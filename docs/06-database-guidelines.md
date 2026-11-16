# 06 — Database Guidelines

## Purpose

Standards and best practices for database design, migrations, and query optimization in VidyaFloww.

## Database: PostgreSQL 16

VidyaFloww uses **PostgreSQL 16** as its primary database. Choose PostgreSQL-native features
over Django-generic equivalents where performance matters (e.g., `JSONField`, `ArrayField`,
`GinIndex`, `pg_trgm` for search).

## Model Design Standards

### Base Model

All models **must** inherit from a base `TimestampedModel`:

```python
# common/models/__init__.py
from django.db import models
import uuid

class TimestampedModel(models.Model):
    """
    Base model providing UUID primary key and audit timestamps.
    All VidyaFloww models should inherit from this.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True
        ordering = ["-created_at"]
```

### Naming Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| Table names | `snake_case` (auto from model) | `students_student` |
| Column names | `snake_case` | `enrollment_date` |
| Foreign keys | `{model}_id` | `student_id` |
| Boolean fields | `is_` prefix | `is_active`, `is_verified` |
| Timestamps | `_at` suffix | `enrolled_at`, `graduated_at` |
| Indexes | `idx_{table}_{column}` | `idx_students_enrollment_date` |

### Indexing Rules

- Always index foreign keys (Django does this automatically)
- Index columns used in `filter()` queries
- Use composite indexes for common multi-column filters
- Use `GinIndex` for `JSONField` and full-text search

### Migrations

- **Never edit an existing migration.** Create a new one.
- **Squash migrations** before each major release using `squashmigrations`.
- Add `db_table` in `Meta` for important models to avoid auto-naming surprises.
- Run `python manage.py migrate --check` in CI to detect unapplied migrations.

### Multi-Tenancy

Every tenant-scoped model must have:
```python
organization = models.ForeignKey(
    "core.organizations.Organization",
    on_delete=models.CASCADE,
    related_name="%(class)ss",
    db_index=True,
)
```

All querysets must be filtered by `organization_id` — enforced via a custom manager.

## Query Optimization Rules

- Use `select_related()` for `ForeignKey` and `OneToOneField`
- Use `prefetch_related()` for `ManyToManyField` and reverse FK
- Use `only()` or `defer()` when fetching large models with few columns needed
- Use `values()` or `values_list()` for read-only aggregations
- Avoid N+1 queries — use Django Debug Toolbar in development to detect them
- Use `bulk_create()` and `bulk_update()` for batch operations

## Soft Deletes

> TODO: Implement soft delete mixin in `common.models.SoftDeleteModel`.

Sensitive data (students, staff, financial records) should use soft delete:
- Add `deleted_at` field instead of actual deletion
- Override default manager to exclude soft-deleted records
- Provide `all_objects` manager that includes deleted records

---

*Last updated: 2026-07-02*
