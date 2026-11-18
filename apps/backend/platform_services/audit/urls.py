from django.urls import path
from .views import AuditEventListView

urlpatterns = [
    path("events/", AuditEventListView.as_view(), name="audit-events"),
]
