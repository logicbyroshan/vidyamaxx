from rest_framework import serializers
from .models import (
    ALLOWED_ACTIONS,
    ResponsibilityAssignmentHistory,
    SecurityPolicy,
    StaffResponsibilityAssignment,
    WorkDivision,
)


class StaffResponsibilitySerializer(serializers.ModelSerializer):
    staff_name = serializers.CharField(source="membership.user.full_name", read_only=True)
    staff_email = serializers.EmailField(source="membership.user.email", read_only=True)
    is_active = serializers.BooleanField(source="is_currently_active", read_only=True)

    class Meta:
        model = StaffResponsibilityAssignment
        fields = [
            "id",
            "membership_id",
            "staff_name",
            "staff_email",
            "work_division",
            "submodule_code",
            "actions",
            "branch_ids",
            "grade_class_ids",
            "section_ids",
            "subject_ids",
            "student_ids",
            "valid_from",
            "valid_until",
            "revoked_at",
            "is_active",
            "notes",
            "created_at",
        ]


class CreateResponsibilitySerializer(serializers.Serializer):
    membership_id = serializers.UUIDField()
    work_division = serializers.ChoiceField(choices=WorkDivision.choices)
    submodule_code = serializers.CharField(max_length=60, default="*", required=False)
    actions = serializers.ListField(
        child=serializers.ChoiceField(choices=ALLOWED_ACTIONS),
        min_length=1,
    )
    branch_ids = serializers.ListField(child=serializers.UUIDField(), required=False, default=list)
    grade_class_ids = serializers.ListField(child=serializers.UUIDField(), required=False, default=list)
    section_ids = serializers.ListField(child=serializers.UUIDField(), required=False, default=list)
    subject_ids = serializers.ListField(child=serializers.UUIDField(), required=False, default=list)
    student_ids = serializers.ListField(child=serializers.UUIDField(), required=False, default=list)
    valid_from = serializers.DateTimeField(required=False)
    valid_until = serializers.DateTimeField(required=False, allow_null=True)
    notes = serializers.CharField(required=False, allow_blank=True, default="")


class ResponsibilityHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ResponsibilityAssignmentHistory
        fields = ["id", "assignment_id", "membership_id", "event_type", "actor_user_id", "snapshot_json", "created_at"]


class SecurityPolicySerializer(serializers.ModelSerializer):
    class Meta:
        model = SecurityPolicy
        fields = ["id", "two_factor_enforced", "session_timeout_minutes", "ip_whitelist_cidrs", "updated_at"]
        read_only_fields = ["id", "updated_at"]
