"""
VidyaFloww Library Catalog & Circulation Summary Models (Work Division #13)
"""

from django.db import models
from common.models import TenantScopedModel


class LibraryBookSummary(TenantScopedModel):
    isbn_or_code = models.CharField(max_length=50)
    title = models.CharField(max_length=200)
    author = models.CharField(max_length=150, default="NCERT")
    category = models.CharField(max_length=80, default="Academic Textbook")
    total_copies = models.PositiveSmallIntegerField(default=10)
    available_copies = models.PositiveSmallIntegerField(default=8)

    class Meta:
        db_table = "library_book_summary"
        ordering = ["title"]
