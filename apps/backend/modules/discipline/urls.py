from django.urls import path
from .views import (
    CircularBroadcastListCreateView,
    CounsellingRecordListCreateView,
    GrievanceTicketDetailView,
    GrievanceTicketListCreateView,
    InfirmaryVisitListCreateView,
    SurveyCampaignListCreateView,
    SurveyCampaignVoteView,
)

urlpatterns = [
    path("health/visits/", InfirmaryVisitListCreateView.as_view(), name="engagement-health-visits"),
    path("counselling/records/", CounsellingRecordListCreateView.as_view(), name="engagement-counselling"),
    path("circulars/", CircularBroadcastListCreateView.as_view(), name="engagement-circulars"),
    path("surveys/", SurveyCampaignListCreateView.as_view(), name="engagement-surveys"),
    path("surveys/<uuid:pk>/vote/", SurveyCampaignVoteView.as_view(), name="engagement-survey-vote"),
    path("complaints/", GrievanceTicketListCreateView.as_view(), name="engagement-complaints"),
    path("complaints/<uuid:pk>/", GrievanceTicketDetailView.as_view(), name="engagement-complaint-detail"),
]
