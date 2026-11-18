from django.urls import path
from .views import (
    ResponsibilityHistoryView,
    ResponsibilityListCreateView,
    ResponsibilityRevokeView,
    SecurityPolicyView,
)

urlpatterns = [
    path("responsibilities/", ResponsibilityListCreateView.as_view(), name="responsibility-list-create"),
    path("responsibilities/<uuid:pk>/", ResponsibilityRevokeView.as_view(), name="responsibility-revoke"),
    path("responsibilities/history/", ResponsibilityHistoryView.as_view(), name="responsibility-history"),
    path("policies/", SecurityPolicyView.as_view(), name="security-policies"),
]
