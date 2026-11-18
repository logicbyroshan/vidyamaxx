from django.utils import timezone
from rest_framework import serializers
from rest_framework.response import Response
from rest_framework.views import APIView

from common.permissions import IsAuthenticatedTenantMember, resolve_user_tenant_context
from .models import InAppNotification


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = InAppNotification
        fields = ["id", "title", "description", "notification_type", "is_read", "read_at", "action_url", "created_at"]


class NotificationListView(APIView):
    permission_classes = [IsAuthenticatedTenantMember]
    serializer_class = NotificationSerializer

    def get(self, request):
        resolve_user_tenant_context(request, require_school=True)
        qs = InAppNotification.objects.for_school(request.school.id).filter(recipient_user_id=request.user.id)[:50]
        return Response({"success": True, "results": NotificationSerializer(qs, many=True).data})


class NotificationMarkAllReadView(APIView):
    permission_classes = [IsAuthenticatedTenantMember]
    serializer_class = NotificationSerializer

    def post(self, request):
        resolve_user_tenant_context(request, require_school=True)
        updated = (
            InAppNotification.objects.for_school(request.school.id)
            .filter(recipient_user_id=request.user.id, is_read=False)
            .update(is_read=True, read_at=timezone.now())
        )
        return Response({"success": True, "marked_count": updated})
