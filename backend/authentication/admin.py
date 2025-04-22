from django.contrib import admin
from .models import Admin, CustomUser
from django.contrib.auth.admin import UserAdmin

# Register Admin model
class AdminModelAdmin(admin.ModelAdmin):
    list_display = ('email',)
    search_fields = ('email',)

admin.site.register(Admin, AdminModelAdmin)

# Existing CustomUserAdmin class
class CustomUserAdmin(UserAdmin):
    list_display = ('id', 'username', 'email', 'skill', 'designation', 'status', 'is_staff', 'is_active')
    search_fields = ('username', 'email', 'skill', 'designation', 'status')
    ordering = ('id',)

    fieldsets = (
        (None, {'fields': ('username', 'email', 'password')}),
        ('Personal Info', {'fields': ('skill', 'designation', 'status')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2', 'skill', 'designation', 'status', 'is_staff', 'is_active')}
        ),
    )

admin.site.register(CustomUser, CustomUserAdmin)
