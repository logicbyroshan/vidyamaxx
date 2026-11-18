from rest_framework import serializers
from common.validators import normalize_indian_phone
from core.users.models import UserType


class LoginSerializer(serializers.Serializer):
    identifier = serializers.CharField(max_length=180)
    password = serializers.CharField(write_only=True)
    remember_me = serializers.BooleanField(required=False, default=True)
    device_info = serializers.DictField(required=False, default=dict)


class RegisterSerializer(serializers.Serializer):
    full_name = serializers.CharField(max_length=150)
    email = serializers.EmailField(required=False, allow_blank=True, allow_null=True)
    phone = serializers.CharField(max_length=20, required=False, allow_blank=True, allow_null=True)
    school_code = serializers.CharField(max_length=24)
    password = serializers.CharField(min_length=8, write_only=True)
    user_type = serializers.ChoiceField(
        choices=[UserType.STAFF, UserType.STUDENT, UserType.PARENT, UserType.SCHOOL_ADMIN],
        default=UserType.STAFF,
    )
    agreed_to_terms = serializers.BooleanField()

    def validate_agreed_to_terms(self, value):
        if not value:
            raise serializers.ValidationError("You must accept the terms of service.")
        return value

    def validate_phone(self, value):
        if value:
            return normalize_indian_phone(value)
        return None


class OTPRequestSerializer(serializers.Serializer):
    identifier = serializers.CharField(max_length=180)
    purpose = serializers.ChoiceField(choices=["registration", "password_reset", "username_lookup"])


class OTPVerifySerializer(serializers.Serializer):
    identifier = serializers.CharField(max_length=180)
    otp_code = serializers.CharField(min_length=6, max_length=6)
    purpose = serializers.ChoiceField(choices=["registration", "password_reset", "username_lookup"])


class PasswordResetSerializer(serializers.Serializer):
    action_token = serializers.CharField()
    new_password = serializers.CharField(min_length=8, write_only=True)


class UsernameLookupSerializer(serializers.Serializer):
    phone = serializers.CharField(max_length=20)
    date_of_birth = serializers.DateField()
    action_token = serializers.CharField()

    def validate_phone(self, value):
        return normalize_indian_phone(value)


class RefreshTokenSerializer(serializers.Serializer):
    refresh = serializers.CharField(required=False)


class EmptyActionSerializer(serializers.Serializer):
    pass


class MePreferencesSerializer(serializers.Serializer):
    preferences = serializers.DictField()
