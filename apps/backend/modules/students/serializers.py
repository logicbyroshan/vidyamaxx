from rest_framework import serializers
from .models import Student, StudentDossierFieldConfig, StudentEnrollment, StudentLifecycleEvent


class StudentEnrollmentSerializer(serializers.ModelSerializer):
    session_name = serializers.CharField(source="academic_session.name", read_only=True)
    class_name = serializers.CharField(source="grade_class.name", read_only=True)
    section_name = serializers.CharField(source="section.name", read_only=True, default="")

    class Meta:
        model = StudentEnrollment
        fields = [
            "id",
            "academic_session",
            "session_name",
            "grade_class",
            "class_name",
            "section",
            "section_name",
            "roll_number",
            "house_name",
            "enrollment_status",
            "promoted_from",
            "final_gpa",
            "final_attendance_pct",
            "remarks",
            "created_at",
        ]


class StudentLifecycleEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentLifecycleEvent
        fields = [
            "id",
            "event_type",
            "from_session_label",
            "to_session_label",
            "from_class_label",
            "to_class_label",
            "reason",
            "created_at",
        ]


class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = [
            "id",
            "admission_number",
            "full_name",
            "date_of_birth",
            "gender",
            "blood_group",
            "category_quota",
            "aadhaar_masked",
            "avatar_url",
            "status",
            "joined_date",
            "current_academic_session",
            "current_grade_class",
            "current_section",
            "current_roll_number",
            "class_section_label",
            "house_name",
            "class_teacher_name",
            "primary_guardian_name",
            "mother_name",
            "guardian_phone",
            "guardian_email",
            "guardian_occupation",
            "address",
            "city",
            "transport_route_label",
            "bus_stop_label",
            "fee_status",
            "fee_dues_inr",
            "attendance_pct",
            "gpa",
            "medical_notes",
            "custom_fields_json",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]


class PromoteStudentSerializer(serializers.Serializer):
    target_session_id = serializers.UUIDField()
    target_grade_class_id = serializers.UUIDField()
    target_section_id = serializers.UUIDField(required=False, allow_null=True)
    new_roll_number = serializers.CharField(max_length=20, required=False, allow_blank=True, default="")
    final_gpa = serializers.DecimalField(max_digits=4, decimal_places=2, required=False, allow_null=True)
    final_attendance_pct = serializers.DecimalField(max_digits=5, decimal_places=2, required=False, allow_null=True)
    remarks = serializers.CharField(required=False, allow_blank=True, default="")


class LifecycleActionSerializer(serializers.Serializer):
    reason = serializers.CharField(required=False, allow_blank=True, default="")


class StudentDossierFieldSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentDossierFieldConfig
        fields = ["id", "field_key", "label", "category", "field_type", "is_visible", "is_custom"]
        read_only_fields = ["id"]
