"""
VidyaFloww — DPDP Compliance URL Configuration
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ConsentAuditViewSet,
    VerifiableParentalConsentViewSet,
    DataSubjectRequestViewSet,
    PrivacyGrievanceViewSet,
    DataBreachIncidentViewSet,
    dpdp_telemetry_overview,
)

router = DefaultRouter()
router.register(r'consents', ConsentAuditViewSet, basename='dpdp-consent')
router.register(r'parental-consents', VerifiableParentalConsentViewSet, basename='dpdp-vpc')
router.register(r'subject-requests', DataSubjectRequestViewSet, basename='dpdp-dsr')
router.register(r'grievances', PrivacyGrievanceViewSet, basename='dpdp-grievance')
router.register(r'breaches', DataBreachIncidentViewSet, basename='dpdp-breach')

urlpatterns = [
    path('telemetry/', dpdp_telemetry_overview, name='dpdp-telemetry'),
    path('', include(router.urls)),
]
