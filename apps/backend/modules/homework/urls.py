from django.urls import path
from .views import (
    HomeworkAssignmentDetailView,
    HomeworkAssignmentListCreateView,
    HomeworkSubmissionListCreateView,
)

urlpatterns = [
    path("assignments/", HomeworkAssignmentListCreateView.as_view(), name="homework-assignments"),
    path("assignments/<uuid:pk>/", HomeworkAssignmentDetailView.as_view(), name="homework-assignment-detail"),
    path(
        "assignments/<uuid:pk>/submissions/",
        HomeworkSubmissionListCreateView.as_view(),
        name="homework-submissions",
    ),
]
