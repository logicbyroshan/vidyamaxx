# 08 — Module Development Guide

## Purpose

Step-by-step guide for adding new domain modules to VidyaFloww.

## Module Structure

Each module under `apps/backend/modules/` or `apps/backend/platform/` follows this structure:

```
modules/<module_name>/
├── __init__.py
├── admin.py          Django admin registrations
├── apps.py           AppConfig
├── models.py         Data models (empty — use base classes)
├── views.py          DRF ViewSets (thin, delegate to services)
├── urls.py           URL router configuration
├── serializers.py    Input + Output serializers
├── permissions.py    Custom permission classes
├── services.py       Business logic (write operations)
├── selectors.py      Query functions (read operations)
├── filters.py        django-filter FilterSet classes
├── tasks.py          Celery async tasks
├── signals.py        Django signal handlers
└── tests.py          Unit tests (also use tests/ subdirectory)
```

## Step-by-Step: Adding a New Module

### 1. Register the app in settings
Add to `LOCAL_APPS` in `config/settings/base.py`:
```python
"modules.my_new_module",
```

### 2. Create AppConfig in apps.py
```python
from django.apps import AppConfig

class MyNewModuleConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "modules.my_new_module"
    label = "my_new_module"
    verbose_name = "My New Module"
```

### 3. Define models
Inherit from `TimestampedModel`. Add organization FK for tenant isolation.

### 4. Create and apply migrations
```bash
python manage.py makemigrations my_new_module
python manage.py migrate
```

### 5. Write selectors first (TDD approach)
Define read functions before implementing write logic.

### 6. Write services
Implement write operations as plain functions. Call from views only.

### 7. Create ViewSets
Use DRF `ModelViewSet` or `GenericViewSet`. Delegate all logic to services/selectors.

### 8. Register URLs
Create router in `urls.py`, include in root `config/urls.py`.

### 9. Write tests
Minimum 80% coverage. Use factory_boy for test data.

## Service Function Template

```python
# modules/my_module/services.py
import logging
from typing import Any

from .models import MyModel

logger = logging.getLogger("vidyafloww.my_module")


def create_my_entity(
    *,
    organization_id: str,
    name: str,
    # ... other params
) -> MyModel:
    """
    Create a new entity.

    Raises:
        ValidationError: If data is invalid.
        DuplicateEntityError: If entity already exists.
    """
    # TODO: Implement
    raise NotImplementedError
```

---

*Last updated: 2026-07-02*
