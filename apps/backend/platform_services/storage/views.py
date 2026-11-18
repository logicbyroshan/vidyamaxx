from django.core.exceptions import ValidationError as DjangoValidationError
from django.core.files.storage import default_storage
from django.http import FileResponse
from django.shortcuts import get_object_or_404
from rest_framework import serializers, status
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView

from common.exceptions import VidyaFlowError
from common.permissions import IsAuthenticatedTenantMember, resolve_user_tenant_context
from .models import StoredFile
from .services import get_secure_download_info, store_uploaded_file


class StoredFileSerializer(serializers.ModelSerializer):
    download = serializers.SerializerMethodField()

    class Meta:
        model = StoredFile
        fields = [
            "id",
            "original_name",
            "content_type",
            "size_bytes",
            "sha256_checksum",
            "visibility",
            "category",
            "created_at",
            "download",
        ]

    def get_download(self, obj) -> dict:
        return get_secure_download_info(obj)


class FileUploadView(APIView):
    permission_classes = [IsAuthenticatedTenantMember]
    parser_classes = [MultiPartParser, FormParser]
    serializer_class = StoredFileSerializer

    def post(self, request):
        membership = resolve_user_tenant_context(request, require_school=True)
        uploaded = request.FILES.get("file")
        if not uploaded:
            raise VidyaFlowError(message="No file provided in `file` field.", code="FILE_MISSING")

        category = request.data.get("category", StoredFile.Category.DOCUMENT)
        visibility = request.data.get("visibility", StoredFile.Visibility.SCHOOL)
        try:
            stored = store_uploaded_file(
                uploaded_file=uploaded,
                school=request.school,
                branch=getattr(request, "branch", None),
                uploaded_by_id=membership.user_id,
                category=category,
                visibility=visibility,
            )
        except DjangoValidationError as exc:
            raise VidyaFlowError(message=str(exc.message), code="FILE_VALIDATION_ERROR") from exc

        return Response({"success": True, "file": StoredFileSerializer(stored).data}, status=status.HTTP_201_CREATED)


class FileDownloadView(APIView):
    permission_classes = [IsAuthenticatedTenantMember]
    serializer_class = StoredFileSerializer

    def get(self, request, pk):
        resolve_user_tenant_context(request, require_school=True)
        stored = get_object_or_404(StoredFile, id=pk, school=request.school)
        if not default_storage.exists(stored.storage_key):
            raise VidyaFlowError(message="Stored file object not found on disk.", code="FILE_NOT_FOUND", status_code=404)
        fh = default_storage.open(stored.storage_key, "rb")
        return FileResponse(fh, content_type=stored.content_type, as_attachment=True, filename=stored.original_name)
