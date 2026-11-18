from django.urls import path
from .views import (
    AttendanceBulkMarkView,
    AttendanceRecordListView,
    LeaveApplicationDecideView,
    LeaveApplicationListCreateView,
)

urlpatterns = [
    path("records/", AttendanceRecordListView.as_view(), name="attendance-records"),
    path("mark-bulk/", AttendanceBulkMarkView.as_view(), name="attendance-mark-bulk"),
    path("leaves/", LeaveApplicationListCreateView.as_view(), name="attendance-leaves"),
    path("leaves/<uuid:pk>/decide/", LeaveApplicationDecideView.as_view(), name="attendance-leave-decide"),
]
