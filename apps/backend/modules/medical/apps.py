from django.apps import AppConfig


class MedicalConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "modules.medical"
    label = "medical"
    verbose_name = "Student Health & Infirmary Records"
