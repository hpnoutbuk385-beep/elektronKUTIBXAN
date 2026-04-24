from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Organization, UserCredentials

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'role', 'organization', 'points', 'is_staff')
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('role', 'organization', 'phone', 'points', 'qr_code')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        (None, {'fields': ('role', 'organization', 'phone', 'points')}),
    )

@admin.register(UserCredentials)
class UserCredentialsAdmin(admin.ModelAdmin):
    list_display = ('username', 'first_name', 'last_name', 'role', 'organization')
    list_filter = ('role', 'organization')
    search_fields = ('username', 'first_name', 'last_name')
    
    def get_queryset(self, request):
        # Adminlar faqat o'quvchi va o'qituvchilarni ko'rsin (ixtiyoriy)
        return super().get_queryset(request).exclude(role='SUPERADMIN')

@admin.register(Organization)
class OrganizationAdmin(admin.ModelAdmin):
    list_display = ('name', 'org_type', 'parent', 'region_name')
    list_filter = ('org_type', 'region_name')
    search_fields = ('name',)
