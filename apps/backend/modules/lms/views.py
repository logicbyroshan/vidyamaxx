from django.shortcuts import get_object_or_404
from rest_framework import serializers, status
from rest_framework.response import Response
from rest_framework.views import APIView

from common.permissions import HasWorkDivisionAccess, IsAuthenticatedTenantMember, resolve_user_tenant_context
from core.permissions.models import WorkDivision
from .models import LearningResource, LessonPlan, OnlineClassSession, TeachingDiaryEntry


class LessonPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = LessonPlan
        fields = [
            "id",
            "plan_code",
            "class_section_label",
            "subject_name",
            "teacher_name",
            "unit_title",
            "topic_title",
            "scheduled_date",
            "duration_minutes",
            "pedagogy_method",
            "learning_objectives",
            "completion_pct",
            "status",
            "hod_remarks",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]


class TeachingDiaryEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = TeachingDiaryEntry
        fields = [
            "id",
            "entry_date",
            "period_label",
            "class_section_label",
            "subject_name",
            "teacher_name",
            "topic_covered",
            "homework_assigned",
            "notes",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]


class LearningResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = LearningResource
        fields = [
            "id",
            "resource_code",
            "title",
            "subject_name",
            "class_label",
            "resource_type",
            "file_url",
            "uploaded_by_name",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]


class OnlineClassSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = OnlineClassSession
        fields = [
            "id",
            "session_code",
            "title",
            "class_section_label",
            "subject_name",
            "teacher_name",
            "scheduled_start",
            "duration_minutes",
            "meeting_url",
            "status",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]


class LessonPlanListCreateView(APIView):
    work_division = WorkDivision.TEACHING
    serializer_class = LessonPlanSerializer

    def get_permissions(self):
        return [IsAuthenticatedTenantMember()] if self.request.method == "GET" else [HasWorkDivisionAccess()]

    def get(self, request):
        resolve_user_tenant_context(request, require_school=True)
        qs = LessonPlan.objects.for_school(request.school.id)
        class_sec = request.query_params.get("class_section")
        if class_sec:
            qs = qs.filter(class_section_label__iexact=class_sec)
        payload = LessonPlanSerializer(qs, many=True).data
        return Response({"success": True, "data": payload, "results": payload})

    def post(self, request):
        membership = resolve_user_tenant_context(request, require_school=True)
        serializer = LessonPlanSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        plan = serializer.save(
            school=request.school,
            branch=getattr(request, "branch", None),
            created_by_id=membership.user_id,
        )
        payload = LessonPlanSerializer(plan).data
        return Response({"success": True, "data": payload, "lesson_plan": payload}, status=status.HTTP_201_CREATED)


class LessonPlanDetailView(APIView):
    work_division = WorkDivision.TEACHING
    serializer_class = LessonPlanSerializer
    permission_classes = [HasWorkDivisionAccess]

    def patch(self, request, pk):
        membership = resolve_user_tenant_context(request, require_school=True)
        plan = get_object_or_404(LessonPlan, id=pk, school=request.school)
        serializer = LessonPlanSerializer(plan, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        plan = serializer.save(updated_by_id=membership.user_id)
        payload = LessonPlanSerializer(plan).data
        return Response({"success": True, "data": payload, "lesson_plan": payload})


class TeachingDiaryListCreateView(APIView):
    work_division = WorkDivision.TEACHING
    serializer_class = TeachingDiaryEntrySerializer

    def get_permissions(self):
        return [IsAuthenticatedTenantMember()] if self.request.method == "GET" else [HasWorkDivisionAccess()]

    def get(self, request):
        resolve_user_tenant_context(request, require_school=True)
        qs = TeachingDiaryEntry.objects.for_school(request.school.id)
        payload = TeachingDiaryEntrySerializer(qs, many=True).data
        return Response({"success": True, "data": payload, "results": payload})

    def post(self, request):
        membership = resolve_user_tenant_context(request, require_school=True)
        serializer = TeachingDiaryEntrySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        entry = serializer.save(
            school=request.school,
            branch=getattr(request, "branch", None),
            created_by_id=membership.user_id,
        )
        payload = TeachingDiaryEntrySerializer(entry).data
        return Response({"success": True, "data": payload, "diary": payload}, status=status.HTTP_201_CREATED)


class LearningResourceListCreateView(APIView):
    work_division = WorkDivision.LEARNING_RESOURCES
    serializer_class = LearningResourceSerializer

    def get_permissions(self):
        return [IsAuthenticatedTenantMember()] if self.request.method == "GET" else [HasWorkDivisionAccess()]

    def get(self, request):
        resolve_user_tenant_context(request, require_school=True)
        qs = LearningResource.objects.for_school(request.school.id)
        payload = LearningResourceSerializer(qs, many=True).data
        return Response({"success": True, "data": payload, "results": payload})

    def post(self, request):
        membership = resolve_user_tenant_context(request, require_school=True)
        serializer = LearningResourceSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        res_obj = serializer.save(
            school=request.school,
            branch=getattr(request, "branch", None),
            created_by_id=membership.user_id,
        )
        payload = LearningResourceSerializer(res_obj).data
        return Response({"success": True, "data": payload}, status=status.HTTP_201_CREATED)


class OnlineClassSessionListCreateView(APIView):
    work_division = WorkDivision.ONLINE_CLASSES
    serializer_class = OnlineClassSessionSerializer

    def get_permissions(self):
        return [IsAuthenticatedTenantMember()] if self.request.method == "GET" else [HasWorkDivisionAccess()]

    def get(self, request):
        resolve_user_tenant_context(request, require_school=True)
        qs = OnlineClassSession.objects.for_school(request.school.id)
        payload = OnlineClassSessionSerializer(qs, many=True).data
        return Response({"success": True, "data": payload, "results": payload})

    def post(self, request):
        membership = resolve_user_tenant_context(request, require_school=True)
        serializer = OnlineClassSessionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        sess = serializer.save(
            school=request.school,
            branch=getattr(request, "branch", None),
            created_by_id=membership.user_id,
        )
        payload = OnlineClassSessionSerializer(sess).data
        return Response({"success": True, "data": payload}, status=status.HTTP_201_CREATED)
