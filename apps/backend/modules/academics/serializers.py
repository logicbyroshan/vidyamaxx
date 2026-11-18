from rest_framework import serializers
from .models import (
    AcademicMilestone,
    AcademicSession,
    ClassSubjectMapping,
    Department,
    GradeClass,
    House,
    Section,
    Subject,
)


class AcademicSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AcademicSession
        fields = ["id", "name", "code", "start_date", "end_date", "is_current", "created_at"]
        read_only_fields = ["id", "created_at"]


class SectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Section
        fields = ["id", "grade_class", "name", "code", "capacity", "room_number", "class_teacher_id"]
        read_only_fields = ["id"]


class ClassSubjectMappingSerializer(serializers.ModelSerializer):
    code = serializers.CharField(source="subject.code", read_only=True)
    name = serializers.CharField(source="subject.name", read_only=True)
    type = serializers.CharField(source="subject.curriculum_tier", read_only=True)
    subject_code = serializers.CharField(source="subject.code", read_only=True)
    subject_name = serializers.CharField(source="subject.name", read_only=True)
    curriculum_tier = serializers.CharField(source="subject.curriculum_tier", read_only=True)

    class Meta:
        model = ClassSubjectMapping
        fields = [
            "id",
            "grade_class",
            "subject",
            "code",
            "name",
            "type",
            "subject_code",
            "subject_name",
            "curriculum_tier",
            "weekly_periods",
            "theory_marks",
            "internal_marks",
            "teacher_in_charge",
            "syllabus_chapters",
            "prescribed_book_json",
            "status",
        ]
        read_only_fields = ["id"]


class GradeClassSerializer(serializers.ModelSerializer):
    sections = SectionSerializer(many=True, read_only=True)
    subjects = ClassSubjectMappingSerializer(source="subject_mappings", many=True, read_only=True)
    subject_mappings = ClassSubjectMappingSerializer(many=True, read_only=True)

    class Meta:
        model = GradeClass
        fields = [
            "id",
            "code",
            "name",
            "hindi_name",
            "numeric_grade",
            "stage",
            "class_mentor_name",
            "room_number",
            "display_order",
            "sections",
            "subjects",
            "subject_mappings",
        ]
        read_only_fields = ["id"]


class AcademicMilestoneSerializer(serializers.ModelSerializer):
    class_code = serializers.CharField(source="grade_class.code", read_only=True)

    class Meta:
        model = AcademicMilestone
        fields = [
            "id",
            "grade_class",
            "class_code",
            "academic_session",
            "title",
            "term",
            "start_date",
            "end_date",
            "target_syllabus_coverage",
            "assessment_type",
            "status",
            "notes",
        ]
        read_only_fields = ["id"]


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ["id", "code", "name", "head_staff_name"]
        read_only_fields = ["id"]


class HouseSerializer(serializers.ModelSerializer):
    class Meta:
        model = House
        fields = ["id", "code", "name", "color_hex", "motto"]
        read_only_fields = ["id"]


class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = ["id", "code", "name", "department", "curriculum_tier", "is_elective"]
        read_only_fields = ["id"]
