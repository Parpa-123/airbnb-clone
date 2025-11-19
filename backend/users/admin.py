from django.contrib import admin
from .models import User
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _

class UserAdmin(BaseUserAdmin):
    list_display = ('email', 'username')
    
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        (_('Personal info'), {'fields': ('username', 'avatar', 'phone')}),
        (_('Permissions'), {'fields': ('is_active', 'is_staff', 'is_superuser', 'is_host')}),
        (_('Important dates'), {'fields': ('last_login', )}),
    )
    readonly_fields = ('last_login',)
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2'),
        }),
        (_('Personal info'), {'fields': ('username', 'avatar', 'phone')}),
        (_('Permissions'), {'fields': ('is_active', 'is_staff', 'is_superuser', 'is_host')}),
    )
    search_fields = ('email', 'username')
    list_filter = ('is_active', 'is_staff', 'is_superuser', 'is_host')
    ordering = ('email',)
    filter_horizontal = ()

admin.site.register(User, UserAdmin)