from django.apps import AppConfig


class HomeworkConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "modules.homework"
    label = "homework"
    verbose_name = "Homework & Student Assignments"
