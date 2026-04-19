from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Organization

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'role', 'organization', 'points', 'is_staff')
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('role', 'organization', 'phone', 'points', 'qr_code')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        (None, {'fields': ('role', 'organization', 'phone', 'points')}),
    )

@admin.register(Organization)
class OrganizationAdmin(admin.ModelAdmin):
    list_display = ('name', 'org_type', 'parent', 'region_name')
    list_filter = ('org_type', 'region_name')
    search_fields = ('name',)
