from django.urls import path
from .views import (
    ExaminationCycleListCreateView,
    ExaminationCycleLockView,
    StudentExamMarkListCreateView,
)

urlpatterns = [
    path("cycles/", ExaminationCycleListCreateView.as_view(), name="exam-cycles"),
    path("cycles/<uuid:pk>/lock/", ExaminationCycleLockView.as_view(), name="exam-cycle-lock"),
    path("marks/", StudentExamMarkListCreateView.as_view(), name="exam-marks"),
]
