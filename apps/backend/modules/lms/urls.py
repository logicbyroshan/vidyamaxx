from django.urls import path
from .views import (
    LearningResourceListCreateView,
    LessonPlanDetailView,
    LessonPlanListCreateView,
    OnlineClassSessionListCreateView,
    TeachingDiaryListCreateView,
)

urlpatterns = [
    path("lesson-plans/", LessonPlanListCreateView.as_view(), name="teaching-lesson-plans"),
    path("lesson-plans/<uuid:pk>/", LessonPlanDetailView.as_view(), name="teaching-lesson-plan-detail"),
    path("diary/", TeachingDiaryListCreateView.as_view(), name="teaching-diary"),
    path("resources/", LearningResourceListCreateView.as_view(), name="lms-resources"),
    path("online-classes/", OnlineClassSessionListCreateView.as_view(), name="lms-online-classes"),
]
