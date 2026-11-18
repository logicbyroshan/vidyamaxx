from django.urls import path
from .views import (
    ProxySubstitutionListCreateView,
    TimetableEntryDetailView,
    TimetableEntryListCreateView,
)

urlpatterns = [
    path("entries/", TimetableEntryListCreateView.as_view(), name="timetable-entries"),
    path("entries/<uuid:pk>/", TimetableEntryDetailView.as_view(), name="timetable-entry-detail"),
    path("substitutions/", ProxySubstitutionListCreateView.as_view(), name="timetable-substitutions"),
]
