from django.contrib import admin

from .models import Room, Message


@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = ("name", "listing", "host", "guest", "created_at")
    list_filter = ("listing", "host")
    search_fields = ("name", "listing__title", "host__username", "guest__username")


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ("user", "room", "created_at")
    list_filter = ("room",)
    search_fields = ("content",)
