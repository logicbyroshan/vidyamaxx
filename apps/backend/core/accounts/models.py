"""
VidyaFloww Canonical User Identity Model
"""

from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.db.models import Q
from django.utils import timezone

from common.models import TimestampedModel
from common.validators import normalize_indian_phone


class UserManager(BaseUserManager):
    """Custom manager supporting email or Indian mobile authentication."""

    def _normalize_inputs(self, email=None, phone=None):
        clean_email = self.normalize_email(email).lower() if email else None
        clean_phone = normalize_indian_phone(phone) if phone else None
        return clean_email, clean_phone

    def create_user(self, email=None, phone=None, password=None, full_name="", **extra_fields):
        clean_email, clean_phone = self._normalize_inputs(email=email, phone=phone)
        if not clean_email and not clean_phone:
            raise ValueError("A user must have at least an email address or a phone number.")

        user = self.model(
            email=clean_email,
            phone=clean_phone,
            full_name=full_name.strip(),
            **extra_fields,
        )
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, full_name="Platform Root", **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)
        extra_fields.setdefault("is_verified", True)
        if not extra_fields.get("is_staff") or not extra_fields.get("is_superuser"):
            raise ValueError("Superuser must have is_staff=True and is_superuser=True.")
        return self.create_user(email=email, password=password, full_name=full_name, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin, TimestampedModel):
    """
    Platform-wide single identity record.
    A user may hold multiple school memberships across tenants via `core_users.Membership`.
    """

    email = models.EmailField(unique=True, null=True, blank=True, db_index=True)
    phone = models.CharField(max_length=20, unique=True, null=True, blank=True, db_index=True)
    full_name = models.CharField(max_length=150)
    hindi_name = models.CharField(max_length=150, blank=True, default="")
    date_of_birth = models.DateField(null=True, blank=True)
    avatar_url = models.URLField(blank=True, default="")

    is_verified = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)  # Django admin site access only
    date_joined = models.DateTimeField(default=timezone.now)
    password_changed_at = models.DateTimeField(null=True, blank=True)

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["full_name"]

    class Meta:
        db_table = "core_accounts_user"
        verbose_name = "User"
        verbose_name_plural = "Users"
        constraints = [
            models.CheckConstraint(
                condition=Q(email__isnull=False) | Q(phone__isnull=False),
                name="chk_user_email_or_phone_present",
            )
        ]

    def __str__(self):
        return f"{self.full_name} ({self.email or self.phone})"
