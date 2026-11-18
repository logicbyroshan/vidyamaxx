"""
VidyaFloww Shared Abstract Base Models & Tenant QuerySets
"""

import uuid
from django.db import models
from django.utils import timezone


class UUIDModel(models.Model):
    """Base model using UUID v4 primary keys."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    class Meta:
        abstract = True


class TimestampedModel(UUIDModel):
    """Base model with automatic UTC creation and update timestamps."""

    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True
        ordering = ["-created_at"]


class TenantQuerySet(models.QuerySet):
    """QuerySet enforcing explicit school and branch scoping."""

    def for_school(self, school_id):
        if school_id is None:
            return self.none()
        return self.filter(school_id=school_id)

    def for_branch(self, branch_id):
        if branch_id is None:
            return self
        return self.filter(models.Q(branch_id=branch_id) | models.Q(branch_id__isnull=True))


class TenantManager(models.Manager):
    """Default manager exposing tenant-scoped query helpers."""

    def get_queryset(self):
        return TenantQuerySet(self.model, using=self._db)

    def for_school(self, school_id):
        return self.get_queryset().for_school(school_id)

    def for_branch(self, branch_id):
        return self.get_queryset().for_branch(branch_id)


class ActiveTenantManager(TenantManager):
    """Manager automatically excluding soft-deleted rows."""

    def get_queryset(self):
        return super().get_queryset().filter(deleted_at__isnull=True)


class TenantScopedModel(TimestampedModel):
    """
    Base model for all school-owned domain records.
    Provides mandatory school FK, optional branch FK, and actor tracking.
    """

    school = models.ForeignKey(
        "organizations.School",
        on_delete=models.CASCADE,
        related_name="%(app_label)s_%(class)s_set",
        db_index=True,
    )
    branch = models.ForeignKey(
        "campuses.Branch",
        on_delete=models.PROTECT,
        related_name="%(app_label)s_%(class)s_set",
        null=True,
        blank=True,
        db_index=True,
    )
    created_by_id = models.UUIDField(null=True, blank=True)
    updated_by_id = models.UUIDField(null=True, blank=True)

    objects = TenantManager()

    class Meta:
        abstract = True
        ordering = ["-created_at"]


class SoftDeleteMixin(models.Model):
    """
    Soft deletion mixin for top-level master entities (Student, StaffProfile, Branch).
    Never apply to immutable financial ledgers or audit logs.
    """

    deleted_at = models.DateTimeField(null=True, blank=True, db_index=True)
    deleted_by_id = models.UUIDField(null=True, blank=True)

    class Meta:
        abstract = True

    def soft_delete(self, by_user_id=None):
        self.deleted_at = timezone.now()
        self.deleted_by_id = by_user_id
        self.save(update_fields=["deleted_at", "deleted_by_id", "updated_at"])
