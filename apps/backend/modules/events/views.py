from rest_framework import serializers, status
from rest_framework.response import Response
from rest_framework.views import APIView

from common.permissions import HasWorkDivisionAccess, IsAuthenticatedTenantMember, resolve_user_tenant_context
from core.permissions.models import WorkDivision
from modules.certificates.models import CertificateTemplate, IssuedCertificate
from modules.documents.models import ComplianceDocumentRecord
from modules.hostel.models import HostelAllocationRecord
from modules.inventory.models import FixedAssetRecord, InventoryStockItem
from modules.library.models import LibraryBookSummary
from modules.transport.models import TransportRouteRecord
from .models import FrontOfficeVisitorPass, SchoolCalendarEvent, StudentActivityRecord


class CertificateTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CertificateTemplate
        fields = ["id", "code", "title", "certificate_type", "template_html", "design_lab_template_id", "created_at"]
        read_only_fields = ["id", "created_at"]


class IssuedCertificateSerializer(serializers.ModelSerializer):
    class Meta:
        model = IssuedCertificate
        fields = [
            "id",
            "serial_number",
            "certificate_type",
            "recipient_code",
            "recipient_name",
            "class_or_dept",
            "issue_date",
            "reason",
            "verification_hash",
            "status",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]


class ComplianceDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ComplianceDocumentRecord
        fields = [
            "id",
            "owner_code",
            "owner_name",
            "document_name",
            "document_category",
            "verification_status",
            "file_url",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]


class LibraryBookSerializer(serializers.ModelSerializer):
    class Meta:
        model = LibraryBookSummary
        fields = ["id", "isbn_or_code", "title", "author", "category", "total_copies", "available_copies"]
        read_only_fields = ["id"]


class TransportRouteSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransportRouteRecord
        fields = [
            "id",
            "route_code",
            "route_name",
            "vehicle_number",
            "driver_name",
            "driver_phone",
            "capacity",
            "assigned_students_count",
        ]
        read_only_fields = ["id"]


class HostelAllocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = HostelAllocationRecord
        fields = ["id", "hostel_block", "room_number", "admission_number", "student_name", "warden_name", "status"]
        read_only_fields = ["id"]


class InventoryStockSerializer(serializers.ModelSerializer):
    class Meta:
        model = InventoryStockItem
        fields = ["id", "sku_code", "item_name", "category", "quantity_on_hand", "reorder_threshold", "unit_label"]
        read_only_fields = ["id"]


class FixedAssetSerializer(serializers.ModelSerializer):
    class Meta:
        model = FixedAssetRecord
        fields = [
            "id",
            "asset_tag",
            "asset_name",
            "location_room",
            "purchase_value_inr",
            "condition_status",
            "last_service_notes",
        ]
        read_only_fields = ["id"]


class SchoolCalendarEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = SchoolCalendarEvent
        fields = ["id", "title", "category", "start_date", "end_date", "venue", "audience"]
        read_only_fields = ["id"]


class StudentActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentActivityRecord
        fields = ["id", "activity_name", "club_or_house", "coordinator_name", "participant_count", "achievement_notes"]
        read_only_fields = ["id"]


class VisitorPassSerializer(serializers.ModelSerializer):
    class Meta:
        model = FrontOfficeVisitorPass
        fields = [
            "id",
            "pass_number",
            "visitor_name",
            "visitor_phone",
            "purpose",
            "person_to_meet",
            "visit_date",
            "check_in_time",
            "check_out_time",
            "status",
        ]
        read_only_fields = ["id"]


def _make_list_create_view(model_cls, serializer_cls, division):
    class GenericTenantListCreateView(APIView):
        work_division = division
        serializer_class = serializer_cls

        def get_permissions(self):
            return [IsAuthenticatedTenantMember()] if self.request.method == "GET" else [HasWorkDivisionAccess()]

        def get(self, request):
            resolve_user_tenant_context(request, require_school=True)
            qs = model_cls.objects.for_school(request.school.id)
            payload = serializer_cls(qs, many=True).data
            return Response({"success": True, "data": payload, "results": payload})

        def post(self, request):
            membership = resolve_user_tenant_context(request, require_school=True)
            serializer = serializer_cls(data=request.data)
            serializer.is_valid(raise_exception=True)
            obj = serializer.save(
                school=request.school,
                branch=getattr(request, "branch", None),
                created_by_id=membership.user_id,
            )
            payload = serializer_cls(obj).data
            return Response({"success": True, "data": payload}, status=status.HTTP_201_CREATED)

    return GenericTenantListCreateView


CertificateTemplateListCreateView = _make_list_create_view(
    CertificateTemplate, CertificateTemplateSerializer, WorkDivision.DOCUMENTS_CERTIFICATES
)
IssuedCertificateListCreateView = _make_list_create_view(
    IssuedCertificate, IssuedCertificateSerializer, WorkDivision.DOCUMENTS_CERTIFICATES
)
ComplianceDocumentListCreateView = _make_list_create_view(
    ComplianceDocumentRecord, ComplianceDocumentSerializer, WorkDivision.DOCUMENTS_CERTIFICATES
)
LibraryBookListCreateView = _make_list_create_view(
    LibraryBookSummary, LibraryBookSerializer, WorkDivision.LIBRARY
)
TransportRouteListCreateView = _make_list_create_view(
    TransportRouteRecord, TransportRouteSerializer, WorkDivision.TRANSPORT
)
HostelAllocationListCreateView = _make_list_create_view(
    HostelAllocationRecord, HostelAllocationSerializer, WorkDivision.HOSTEL
)
InventoryItemListCreateView = _make_list_create_view(
    InventoryStockItem, InventoryStockSerializer, WorkDivision.INVENTORY
)
FixedAssetListCreateView = _make_list_create_view(
    FixedAssetRecord, FixedAssetSerializer, WorkDivision.ASSETS_MAINTENANCE
)
SchoolEventListCreateView = _make_list_create_view(
    SchoolCalendarEvent, SchoolCalendarEventSerializer, WorkDivision.EVENTS_CALENDAR
)
StudentActivityListCreateView = _make_list_create_view(
    StudentActivityRecord, StudentActivitySerializer, WorkDivision.STUDENT_ACTIVITIES
)
VisitorPassListCreateView = _make_list_create_view(
    FrontOfficeVisitorPass, VisitorPassSerializer, WorkDivision.FRONT_OFFICE
)
