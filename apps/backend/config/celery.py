"""
VidyaFloww Celery Configuration

Configures the Celery application for asynchronous task processing.
All task modules are auto-discovered from installed Django apps.
"""

import os

from celery import Celery

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.development")

app = Celery("vidyafloww")

app.config_from_object("django.conf:settings", namespace="CELERY")

# Auto-discover tasks from all installed app 'tasks' modules
app.autodiscover_tasks()


@app.task(bind=True, ignore_result=True)
def debug_task(self):
    """Debug task for testing Celery connectivity."""
    print(f"Request: {self.request!r}")
