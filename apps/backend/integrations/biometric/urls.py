from django.urls import path
from .views import BiometricPunchIngestView

urlpatterns = [
    path("punch/", BiometricPunchIngestView.as_view(), name="integrations-biometric-punch"),
]
