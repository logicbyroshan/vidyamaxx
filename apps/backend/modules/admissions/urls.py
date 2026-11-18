from django.urls import path
from .views import (
    AdmissionApplicationListCreateView,
    AdmissionApproveView,
    AdmissionEnrollView,
    AdmissionEnquiryListCreateView,
)

urlpatterns = [
    path("enquiries/", AdmissionEnquiryListCreateView.as_view(), name="admissions-enquiries"),
    path("applications/", AdmissionApplicationListCreateView.as_view(), name="admissions-applications"),
    path("applications/<uuid:pk>/approve/", AdmissionApproveView.as_view(), name="admissions-approve"),
    path("applications/<uuid:pk>/enroll/", AdmissionEnrollView.as_view(), name="admissions-enroll"),
]
