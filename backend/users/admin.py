from django.contrib import admin

from .models import User

from listings import models as listing_models

from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from django.utils.translation import gettext_lazy as _

from bookings import models as booking_models

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

class ListingsAdmin(admin.ModelAdmin):

    list_display = ('title', 'host')

class BookingsAdmin(admin.ModelAdmin):

    list_display = ('guest', 'listing', 'start_date', 'end_date', 'status')

admin.site.register(User, UserAdmin)

admin.site.register(listing_models.Listings, ListingsAdmin)

admin.site.register(listing_models.ListingImages)

admin.site.register(booking_models.Bookings, BookingsAdmin)
