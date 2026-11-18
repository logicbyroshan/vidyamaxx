from django.urls import path
from .views import (
    CertificateTemplateListCreateView,
    ComplianceDocumentListCreateView,
    FixedAssetListCreateView,
    HostelAllocationListCreateView,
    InventoryItemListCreateView,
    IssuedCertificateListCreateView,
    LibraryBookListCreateView,
    SchoolEventListCreateView,
    StudentActivityListCreateView,
    TransportRouteListCreateView,
    VisitorPassListCreateView,
)

urlpatterns = [
    path("certificates/templates/", CertificateTemplateListCreateView.as_view(), name="ops-cert-templates"),
    path("certificates/issued/", IssuedCertificateListCreateView.as_view(), name="ops-cert-issued"),
    path("documents/", ComplianceDocumentListCreateView.as_view(), name="ops-documents"),
    path("library/books/", LibraryBookListCreateView.as_view(), name="ops-library-books"),
    path("transport/routes/", TransportRouteListCreateView.as_view(), name="ops-transport-routes"),
    path("hostel/allocations/", HostelAllocationListCreateView.as_view(), name="ops-hostel-allocations"),
    path("inventory/items/", InventoryItemListCreateView.as_view(), name="ops-inventory-items"),
    path("assets/", FixedAssetListCreateView.as_view(), name="ops-assets"),
    path("events/", SchoolEventListCreateView.as_view(), name="ops-events"),
    path("activities/", StudentActivityListCreateView.as_view(), name="ops-activities"),
    path("front-office/visitors/", VisitorPassListCreateView.as_view(), name="ops-visitors"),
]
