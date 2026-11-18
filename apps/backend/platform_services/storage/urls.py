from django.urls import path
from .views import FileDownloadView, FileUploadView

urlpatterns = [
    path("files/", FileUploadView.as_view(), name="storage-file-upload"),
    path("files/<uuid:pk>/download/", FileDownloadView.as_view(), name="storage-file-download"),
]
