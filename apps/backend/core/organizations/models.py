"""
VidyaFloww Multi-Tenant Customer, School & Subscription Models
"""

from django.conf import settings
from django.db import models
from django.utils import timezone

from common.models import TimestampedModel


class CustomerTenant(TimestampedModel):
    """
    SaaS customer organization owning one or more Schools.
    Managed by a Super Admin (owner) and optionally delegated Super Executives.
    """

    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=100, unique=True)
    owner_user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="owned_tenants",
        null=True,
        blank=True,
    )
    contact_email = models.EmailField()
    contact_phone = models.CharField(max_length=20, blank=True, default="")
    gstin = models.CharField(max_length=20, blank=True, default="")
    billing_address = models.TextField(blank=True, default="")
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = "core_customer_tenant"
        verbose_name = "Customer Tenant"
        verbose_name_plural = "Customer Tenants"

    def __str__(self):
        return f"{self.name} ({self.slug})"


class SubscriptionPlan(TimestampedModel):
    """Commercial SaaS plan tiers."""

    code = models.CharField(max_length=40, unique=True)
    name = models.CharField(max_length=100)
    max_schools = models.PositiveIntegerField(default=1)
    max_students = models.PositiveIntegerField(default=2000)
    price_monthly_inr = models.DecimalField(max_digits=12, decimal_places=2)
    price_annual_inr = models.DecimalField(max_digits=12, decimal_places=2)
    features_json = models.JSONField(default=dict, blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = "core_subscription_plan"

    def __str__(self):
        return f"{self.name} ({self.code})"


class CustomerSubscription(TimestampedModel):
    """Subscription lifecycle record bound to a CustomerTenant."""

    class Status(models.TextChoices):
        TRIAL = "TRIAL", "Trial"
        ACTIVE = "ACTIVE", "Active"
        PAST_DUE = "PAST_DUE", "Past Due"
        CANCELLED = "CANCELLED", "Cancelled"

    tenant = models.ForeignKey(CustomerTenant, on_delete=models.CASCADE, related_name="subscriptions")
    plan = models.ForeignKey(SubscriptionPlan, on_delete=models.PROTECT, related_name="subscriptions")
    license_key_prefix = models.CharField(max_length=20, db_index=True)
    license_key_hash = models.CharField(max_length=128)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.ACTIVE)
    current_period_start = models.DateField(default=timezone.localdate)
    current_period_end = models.DateField()
    payment_method_brand = models.CharField(max_length=40, blank=True, default="VISA")
    payment_method_last4 = models.CharField(max_length=4, blank=True, default="")
    cancelled_at = models.DateTimeField(null=True, blank=True)
    cancelled_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="cancelled_subscriptions",
    )
    cancellation_reason = models.TextField(blank=True, default="")

    class Meta:
        db_table = "core_customer_subscription"

    def __str__(self):
        return f"{self.tenant.slug} - {self.plan.code} ({self.status})"


class PlatformInvoice(TimestampedModel):
    """Billing invoices for SaaS platform subscriptions."""

    class Status(models.TextChoices):
        PAID = "PAID", "Paid"
        PROCESSING = "PROCESSING", "Processing"
        SCHEDULED = "SCHEDULED", "Scheduled"
        FAILED = "FAILED", "Failed"

    subscription = models.ForeignKey(CustomerSubscription, on_delete=models.CASCADE, related_name="invoices")
    invoice_number = models.CharField(max_length=50, unique=True)
    billing_date = models.DateField()
    amount_inr = models.DecimalField(max_digits=12, decimal_places=2)
    description = models.CharField(max_length=255)
    payment_method_label = models.CharField(max_length=100, blank=True, default="")
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.SCHEDULED)
    paid_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "core_platform_invoice"
        ordering = ["-billing_date", "-created_at"]

    def __str__(self):
        return f"{self.invoice_number} ({self.status})"


class School(TimestampedModel):
    """
    Primary institutional boundary for all domain records (`school_id`).
    """

    class BoardAffiliation(models.TextChoices):
        CBSE = "CBSE", "CBSE"
        ICSE = "ICSE", "ICSE"
        STATE = "STATE", "State Board"
        IB = "IB", "IB / IGCSE"
        OTHER = "OTHER", "Other"

    tenant = models.ForeignKey(CustomerTenant, on_delete=models.CASCADE, related_name="schools")
    name = models.CharField(max_length=200)
    short_code = models.CharField(max_length=24, db_index=True)
    tagline = models.CharField(max_length=255, blank=True, default="")
    city = models.CharField(max_length=120, blank=True, default="")
    state = models.CharField(max_length=120, blank=True, default="")
    pincode = models.CharField(max_length=10, blank=True, default="")
    board_affiliation = models.CharField(
        max_length=20, choices=BoardAffiliation.choices, default=BoardAffiliation.CBSE
    )
    affiliation_number = models.CharField(max_length=60, unique=True, null=True, blank=True)
    established_year = models.CharField(max_length=10, blank=True, default="")
    academic_level = models.CharField(max_length=100, default="K-12 Senior Secondary")
    principal_name = models.CharField(max_length=150, blank=True, default="")
    logo_preset = models.CharField(max_length=30, default="building")
    logo_file_id = models.UUIDField(null=True, blank=True)
    custom_logo_url = models.URLField(blank=True, default="")
    timezone = models.CharField(max_length=64, default="Asia/Kolkata")
    currency = models.CharField(max_length=10, default="INR")
    active_academic_session_label = models.CharField(max_length=30, default="2026-2027")
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = "core_school"
        constraints = [
            models.UniqueConstraint(fields=["tenant", "short_code"], name="uq_school_tenant_shortcode")
        ]

    def __str__(self):
        return f"{self.name} [{self.short_code}]"
