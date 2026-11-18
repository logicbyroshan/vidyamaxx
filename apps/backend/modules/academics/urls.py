from django.urls import path
from .views import (
    AcademicMilestoneListCreateView,
    AcademicSessionListCreateView,
    ClassSubjectUpsertView,
    GradeClassDetailView,
    GradeClassListCreateView,
)

urlpatterns = [
    path("sessions/", AcademicSessionListCreateView.as_view(), name="academics-sessions"),
    path("classes/", GradeClassListCreateView.as_view(), name="academics-classes"),
    path("classes/<uuid:pk>/", GradeClassDetailView.as_view(), name="academics-class-detail"),
    path("class-subjects/", ClassSubjectUpsertView.as_view(), name="academics-class-subjects"),
    path("milestones/", AcademicMilestoneListCreateView.as_view(), name="academics-milestones"),
]
