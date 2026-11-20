"""
VidyaFloww Biometric & RFID Hardware Push Ingestion (eSSL / ZKTeco / Matrix)
"""

import hashlib
import hmac
import os
from datetime import date
from django.core.cache import cache
from django.db import transaction

from modules.attendance.models import StudentAttendanceRecord
from modules.students.models import Student


def verify_biometric_device_signature(raw_body: bytes, signature: str, secret: str | None = None) -> bool:
    device_secret = secret or os.getenv("BIOMETRIC_DEVICE_SECRET", "")
    if not device_secret or not signature:
        return False
    expected = hmac.new(device_secret.encode("utf-8"), raw_body, hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected, signature.strip())


@transaction.atomic
def ingest_biometric_punch(
    *,
    school,
    device_id: str,
    punch_uid: str,
    admission_number: str,
    punch_date: date,
    punch_time_str: str,
    is_late: bool = False,
):
    """Idempotently ingest a biometric/RFID gate tap into StudentAttendanceRecord."""
    dedup_key = f"vf:biometric:{school.id}:{device_id}:{punch_uid}"
    if cache.get(dedup_key):
        existing = StudentAttendanceRecord.objects.filter(
            school=school, admission_number=admission_number, attendance_date=punch_date
        ).first()
        return existing, False

    student = Student.objects.filter(school=school, admission_number=admission_number).first()
    status_val = StudentAttendanceRecord.Status.LATE if is_late else StudentAttendanceRecord.Status.PRESENT

    rec, _ = StudentAttendanceRecord.objects.update_or_create(
        school=school,
        admission_number=admission_number,
        attendance_date=punch_date,
        defaults={
            "branch": student.branch if student else None,
            "student": student,
            "student_name": student.full_name if student else admission_number,
            "roll_number": student.current_roll_number if student else "",
            "class_section_label": student.class_section_label if student else "Unassigned",
            "status": status_val,
            "check_in_time": punch_time_str,
            "remarks": f"Biometric Turnstile {device_id}",
        },
    )
    cache.set(dedup_key, True, timeout=24 * 60 * 60)
    return rec, True
