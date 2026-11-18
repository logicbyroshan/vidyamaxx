from django.shortcuts import get_object_or_404
from rest_framework import serializers, status
from rest_framework.response import Response
from rest_framework.views import APIView

from common.permissions import HasWorkDivisionAccess, IsAuthenticatedTenantMember, resolve_user_tenant_context
from core.permissions.models import WorkDivision
from .models import ProxySubstitution, TimetableEntry
from .services import assign_timetable_entry


class TimetableEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = TimetableEntry
        fields = [
            "id",
            "class_section_label",
            "day_of_week",
            "period_number",
            "time_label",
            "subject_code",
            "subject_name",
            "teacher_name",
            "room_label",
            "entry_type",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]


class ProxySubstitutionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProxySubstitution
        fields = [
            "id",
            "substitution_date",
            "timetable_entry",
            "class_section_label",
            "period_number",
            "subject_name",
            "absent_teacher_name",
            "substitute_teacher_name",
            "reason",
            "status",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]


class TimetableEntryListCreateView(APIView):
    work_division = WorkDivision.TIMETABLE
    serializer_class = TimetableEntrySerializer

    def get_permissions(self):
        return [IsAuthenticatedTenantMember()] if self.request.method == "GET" else [HasWorkDivisionAccess()]

    def get(self, request):
        resolve_user_tenant_context(request, require_school=True)
        qs = TimetableEntry.objects.for_school(request.school.id)
        class_sec = request.query_params.get("class_section")
        if class_sec:
            qs = qs.filter(class_section_label__iexact=class_sec)
        teacher = request.query_params.get("teacher")
        if teacher:
            qs = qs.filter(teacher_name__icontains=teacher)
        day = request.query_params.get("day")
        if day:
            qs = qs.filter(day_of_week__iexact=day)
        payload = TimetableEntrySerializer(qs, many=True).data
        return Response({"success": True, "data": payload, "results": payload})

    def post(self, request):
        membership = resolve_user_tenant_context(request, require_school=True)
        serializer = TimetableEntrySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        entry = assign_timetable_entry(
            school=request.school,
            branch=getattr(request, "branch", None),
            actor_membership=membership,
            validated_data=serializer.validated_data,
        )
        payload = TimetableEntrySerializer(entry).data
        return Response(
            {"success": True, "data": payload, "entry": payload},
            status=status.HTTP_201_CREATED,
        )


class TimetableEntryDetailView(APIView):
    work_division = WorkDivision.TIMETABLE
    serializer_class = TimetableEntrySerializer
    permission_classes = [HasWorkDivisionAccess]

    def delete(self, request, pk):
        resolve_user_tenant_context(request, require_school=True)
        entry = get_object_or_404(TimetableEntry, id=pk, school=request.school)
        entry.delete()
        return Response({"success": True, "data": {"id": str(pk), "deleted": True}})


class ProxySubstitutionListCreateView(APIView):
    work_division = WorkDivision.TIMETABLE
    serializer_class = ProxySubstitutionSerializer

    def get_permissions(self):
        return [IsAuthenticatedTenantMember()] if self.request.method == "GET" else [HasWorkDivisionAccess()]

    def get(self, request):
        resolve_user_tenant_context(request, require_school=True)
        qs = ProxySubstitution.objects.for_school(request.school.id)
        payload = ProxySubstitutionSerializer(qs, many=True).data
        return Response({"success": True, "data": payload, "results": payload})

    def post(self, request):
        membership = resolve_user_tenant_context(request, require_school=True)
        serializer = ProxySubstitutionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        sub = serializer.save(
            school=request.school,
            branch=getattr(request, "branch", None),
            created_by_id=membership.user_id,
        )
        payload = ProxySubstitutionSerializer(sub).data
        return Response(
            {"success": True, "data": payload, "substitution": payload},
            status=status.HTTP_201_CREATED,
        )
