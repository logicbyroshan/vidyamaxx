from django.urls import path
from .views import (
    ComplianceFilingListCreateView,
    CrossPlatformAIAssistView,
    DashboardCommandSummaryView,
    DecoupledSubsystemsContractView,
    InstitutionalStatisticsView,
    ReportsListCreateView,
)

urlpatterns = [
    path("dashboard/", DashboardCommandSummaryView.as_view(), name="analytics-dashboard"),
    path("statistics/", InstitutionalStatisticsView.as_view(), name="analytics-statistics"),
    path("reports/", ReportsListCreateView.as_view(), name="analytics-reports"),
    path("compliance/", ComplianceFilingListCreateView.as_view(), name="analytics-compliance"),
    path("ai/assist/", CrossPlatformAIAssistView.as_view(), name="analytics-ai-assist"),
    path("subsystems/", DecoupledSubsystemsContractView.as_view(), name="analytics-subsystems"),
]
