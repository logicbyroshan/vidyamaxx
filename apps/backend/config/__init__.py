"""
VidyaFloww Django Config Package.
Ensures Celery app is always loaded when Django starts so @shared_task binds to it.
"""

from .celery import app as celery_app

__all__ = ("celery_app",)
