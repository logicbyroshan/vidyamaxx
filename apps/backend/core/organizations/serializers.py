from rest_framework import serializers
from .models import CustomerSubscription, PlatformInvoice, School


class SchoolSerializer(serializers.ModelSerializer):
    class Meta:
        model = School
        fields = [
            "id",
            "tenant_id",
            "name",
            "short_code",
            "tagline",
            "city",
            "state",
            "pincode",
            "board_affiliation",
            "affiliation_number",
            "established_year",
            "academic_level",
            "principal_name",
            "logo_preset",
            "logo_file_id",
            "custom_logo_url",
            "timezone",
            "currency",
            "active_academic_session_label",
            "is_active",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "tenant_id", "created_at", "updated_at"]


class PlatformInvoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlatformInvoice
        fields = [
            "id",
            "invoice_number",
            "billing_date",
            "amount_inr",
            "description",
            "payment_method_label",
            "status",
            "paid_at",
        ]


class SubscriptionSerializer(serializers.ModelSerializer):
    plan_name = serializers.CharField(source="plan.name", read_only=True)
    plan_code = serializers.CharField(source="plan.code", read_only=True)
    invoices = PlatformInvoiceSerializer(many=True, read_only=True)

    class Meta:
        model = CustomerSubscription
        fields = [
            "id",
            "tenant_id",
            "plan_code",
            "plan_name",
            "license_key_prefix",
            "status",
            "current_period_start",
            "current_period_end",
            "payment_method_brand",
            "payment_method_last4",
            "cancelled_at",
            "invoices",
        ]
