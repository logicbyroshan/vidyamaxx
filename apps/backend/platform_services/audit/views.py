from django.db.models import Q
from rest_framework import serializers
from rest_framework.generics import ListAPIView

from common.permissions import HasWorkDivisionAccess, resolve_user_tenant_context
from core.permissions.models import WorkDivision
from .models import AuditEvent


class AuditEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuditEvent
        fields = [
            "id",
            "created_at",
            "actor_user_id",
            "actor_name",
            "actor_role_label",
            "category",
            "action",
            "target_type",
            "target_id",
            "ip_address",
            "status",
            "metadata_json",
        ]


class AuditEventListView(ListAPIView):
    """Read-only paginated Audit Trail strictly scoped to the verified School (backs /audit)."""

    work_division = WorkDivision.SECURITY_AUDIT
    permission_classes = [HasWorkDivisionAccess]
    serializer_class = AuditEventSerializer
    queryset = AuditEvent.objects.none()

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return AuditEvent.objects.none()
        resolve_user_tenant_context(self.request, require_school=True)
        qs = AuditEvent.objects.filter(school_id=self.request.school.id)
        category = self.request.query_params.get("category")
        if category:
            qs = qs.filter(category=category)
        status_param = self.request.query_params.get("status")
        if status_param:
            qs = qs.filter(status=status_param)
        search = self.request.query_params.get("search")
        if search:
            qs = qs.filter(
                Q(actor_name__icontains=search) | Q(action__icontains=search) | Q(target_id__icontains=search)
            )
        return qs
