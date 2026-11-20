from django.shortcuts import get_object_or_404
from drf_spectacular.utils import extend_schema
from rest_framework import serializers, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from common.exceptions import ForbiddenActionError
from core.organizations.models import School
from .services import ingest_biometric_punch, verify_biometric_device_signature


class BiometricPunchSerializer(serializers.Serializer):
    school_code = serializers.CharField(max_length=50)
    device_id = serializers.CharField(max_length=60)
    punch_uid = serializers.CharField(max_length=100)
    admission_number = serializers.CharField(max_length=50)
    punch_date = serializers.DateField()
    punch_time_str = serializers.CharField(max_length=25)
    is_late = serializers.BooleanField(default=False)


class BiometricPunchIngestView(APIView):
    permission_classes = [AllowAny]
    serializer_class = BiometricPunchSerializer

    @extend_schema(operation_id="v1_integrations_biometric_punch")
    def post(self, request):
        sig = request.META.get("HTTP_X_BIOMETRIC_SIGNATURE", "")
        if not verify_biometric_device_signature(request.body, sig):
            raise ForbiddenActionError(
                message="Invalid or missing biometric device HMAC signature.",
                code="INVALID_DEVICE_SIGNATURE",
            )
        serializer = BiometricPunchSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        d = serializer.validated_data
        school = get_object_or_404(School, short_code=d["school_code"])
        rec, created = ingest_biometric_punch(
            school=school,
            device_id=d["device_id"],
            punch_uid=d["punch_uid"],
            admission_number=d["admission_number"],
            punch_date=d["punch_date"],
            punch_time_str=d["punch_time_str"],
            is_late=d["is_late"],
        )
        return Response(
            {
                "success": True,
                "record_id": str(rec.id) if rec else None,
                "idempotent_replay": not created,
            },
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
        )
