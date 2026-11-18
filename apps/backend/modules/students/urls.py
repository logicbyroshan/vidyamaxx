from django.urls import path
from .views import (
    StudentDetailView,
    StudentDossierFieldListCreateView,
    StudentListCreateView,
    StudentPromoteView,
    StudentReadmitView,
    StudentWithdrawView,
)

urlpatterns = [
    path("", StudentListCreateView.as_view(), name="student-list-create"),
    path("dossier-fields/", StudentDossierFieldListCreateView.as_view(), name="student-dossier-fields"),
    path("<uuid:pk>/", StudentDetailView.as_view(), name="student-detail"),
    path("<uuid:pk>/promote/", StudentPromoteView.as_view(), name="student-promote"),
    path("<uuid:pk>/withdraw/", StudentWithdrawView.as_view(), name="student-withdraw"),
    path("<uuid:pk>/readmit/", StudentReadmitView.as_view(), name="student-readmit"),
]
