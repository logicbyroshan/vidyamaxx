"""
VidyaFloww Branch / Campus Model
"""

from django.db import models
from common.models import TimestampedModel


class Branch(TimestampedModel):
    """
    Represents a physical campus/branch belonging to a School.
    """

    class Status(models.TextChoices):
        ACTIVE = "ACTIVE", "Active"
        INACTIVE = "INACTIVE", "Inactive"

    school = models.ForeignKey("organizations.School", on_delete=models.CASCADE, related_name="branches")
    code = models.CharField(max_length=30)
    name = models.CharField(max_length=200)
    city = models.CharField(max_length=120, blank=True, default="")
    address = models.TextField(blank=True, default="")
    board = models.CharField(max_length=120, blank=True, default="")
    session_label = models.CharField(max_length=40, default="2026-2027")
    principal_name = models.CharField(max_length=150, blank=True, default="")
    is_primary = models.BooleanField(default=False)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.ACTIVE)
    cover_url = models.URLField(blank=True, default="")
    logo_url = models.URLField(blank=True, default="")

    class Meta:
        db_table = "core_branch"
        verbose_name = "Branch"
        verbose_name_plural = "Branches"
        constraints = [
            models.UniqueConstraint(fields=["school", "code"], name="uq_branch_school_code")
        ]

    def __str__(self):
        return f"{self.name} ({self.code})"
