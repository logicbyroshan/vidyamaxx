"""
VidyaFloww Timetable Conflict-Detection & Scheduling Services
"""

from django.db import transaction
from common.exceptions import ConflictError
from platform_services.audit.services import record_audit_event
from .models import ProxySubstitution, TimetableEntry


@transaction.atomic
def assign_timetable_entry(*, school, branch, actor_membership, validated_data: dict) -> TimetableEntry:
    """
    Enforces Master Prompt Part 10.4:
    Prevents teacher double-booking and room double-booking on the same (day_of_week, period_number)
    before assigning or updating a class-section timetable slot.
    """
    class_sec = validated_data.get("class_section_label", "10-A").strip()
    day = validated_data["day_of_week"]
    period_no = int(validated_data["period_number"])
    teacher_name = validated_data["teacher_name"].strip()
    room_label = validated_data.get("room_label", "").strip()

    # 1. Check Teacher Conflict across other class-sections on the same day & period
    teacher_conflict = (
        TimetableEntry.objects.filter(
            school=school,
            day_of_week=day,
            period_number=period_no,
            teacher_name__iexact=teacher_name,
        )
        .exclude(class_section_label__iexact=class_sec)
        .first()
    )
    if teacher_conflict:
        raise ConflictError(
            message=(
                f"Teacher '{teacher_name}' is already scheduled for {teacher_conflict.class_section_label} "
                f"({teacher_conflict.subject_name}) on {day} Period {period_no}."
            ),
            code="TEACHER_DOUBLE_BOOKED",
            errors={"teacher_name": [f"Already assigned to {teacher_conflict.class_section_label} in Period {period_no}."]},
        )

    # 2. Check Room Conflict across other class-sections on the same day & period
    if room_label and room_label.lower() not in {"ground", "sports ground", "online", "tba"}:
        room_conflict = (
            TimetableEntry.objects.filter(
                school=school,
                day_of_week=day,
                period_number=period_no,
                room_label__iexact=room_label,
            )
            .exclude(class_section_label__iexact=class_sec)
            .first()
        )
        if room_conflict:
            raise ConflictError(
                message=(
                    f"Room '{room_label}' is already occupied by {room_conflict.class_section_label} "
                    f"({room_conflict.subject_name}) on {day} Period {period_no}."
                ),
                code="ROOM_DOUBLE_BOOKED",
                errors={"room_label": [f"Occupied by {room_conflict.class_section_label} in Period {period_no}."]},
            )

    entry, _ = TimetableEntry.objects.update_or_create(
        school=school,
        class_section_label=class_sec,
        day_of_week=day,
        period_number=period_no,
        defaults={
            "branch": branch,
            "created_by_id": actor_membership.user_id,
            "updated_by_id": actor_membership.user_id,
            "time_label": validated_data.get("time_label", "08:00 - 08:45"),
            "subject_code": validated_data.get("subject_code", ""),
            "subject_name": validated_data["subject_name"],
            "teacher_name": teacher_name,
            "room_label": room_label or "Room 101",
            "entry_type": validated_data.get("entry_type", TimetableEntry.EntryType.CORE),
        },
    )

    record_audit_event(
        school_id=school.id,
        tenant_id=school.tenant_id,
        actor_user_id=actor_membership.user_id,
        actor_name=actor_membership.user.full_name,
        actor_role_label=actor_membership.user_type,
        category="Academics",
        action="TIMETABLE_SLOT_ASSIGNED",
        target_type="TimetableEntry",
        target_id=str(entry.id),
        metadata={
            "class_section": class_sec,
            "day": day,
            "period": period_no,
            "teacher": teacher_name,
            "room": room_label,
        },
    )
    return entry
