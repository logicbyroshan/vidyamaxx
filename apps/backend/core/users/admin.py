from django.contrib import admin
from .models import Membership

@admin.register(Membership)
class MembershipAdmin(admin.ModelAdmin):
    list_display = ("user", "tenant", "school", "user_type", "is_active", "joined_at")
    list_filter = ("user_type", "is_active")
    search_fields = ("user__email", "user__phone", "user__full_name", "school__name")
