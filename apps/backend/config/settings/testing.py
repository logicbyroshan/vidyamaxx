"""
VidyaFloww Django Settings — Testing Environment

Overrides base settings for automated testing.
Uses fast password hasher, in-memory cache, and synchronous Celery.
"""

from .base import *  # noqa: F401, F403

# ─── Speed Optimizations ──────────────────────────────────────────────────────

DEBUG = False
SECRET_KEY = "test-secret-key-not-for-production"
PASSWORD_HASHERS = ["django.contrib.auth.hashers.MD5PasswordHasher"]

# ─── Database ─────────────────────────────────────────────────────────────────

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": ":memory:",
    }
}

# ─── Cache ────────────────────────────────────────────────────────────────────

CACHES = {"default": {"BACKEND": "django.core.cache.backends.locmem.LocMemCache"}}

# ─── Celery ───────────────────────────────────────────────────────────────────

CELERY_TASK_ALWAYS_EAGER = True
CELERY_TASK_EAGER_PROPAGATES = True

# ─── Email ────────────────────────────────────────────────────────────────────

EMAIL_BACKEND = "django.core.mail.backends.locmem.EmailBackend"

# ─── Media ────────────────────────────────────────────────────────────────────

DEFAULT_FILE_STORAGE = "django.core.files.storage.InMemoryStorage"
