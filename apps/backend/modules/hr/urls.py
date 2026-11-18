from django.urls import path
from .views import StaffDetailView, StaffDossierFieldListCreateView, StaffListCreateView

urlpatterns = [
    path("", StaffListCreateView.as_view(), name="staff-list-create"),
    path("<uuid:pk>/", StaffDetailView.as_view(), name="staff-detail"),
    path("dossier-fields/", StaffDossierFieldListCreateView.as_view(), name="staff-dossier-fields"),
]
