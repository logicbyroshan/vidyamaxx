from django.contrib import admin
from .models import User

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ("email", "phone", "full_name", "is_verified", "is_active", "created_at")
    search_fields = ("email", "phone", "full_name")
    list_filter = ("is_verified", "is_active", "is_staff")
