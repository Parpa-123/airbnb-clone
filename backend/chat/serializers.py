from rest_framework import serializers

from .models import Room, Message

from listings.serializers import ListingSerializer
from users.serializers import UserSerializer


class MessageSerializer(serializers.ModelSerializer):

    user = UserSerializer(read_only=True)

    class Meta:
        model = Message
        fields = "__all__"
        read_only_fields = ("room", "user", "created_at", "updated_at")


class RoomSerializer(serializers.ModelSerializer):

    host = UserSerializer(read_only=True)
    guest = UserSerializer(read_only=True)
    listing = ListingSerializer(read_only=True)
    last_message = serializers.SerializerMethodField()
    other_user = serializers.SerializerMethodField()

    class Meta:
        model = Room
        fields = (
            "id",
            "name",
            "listing",
            "host",
            "guest",
            "other_user",
            "last_message",
            "created_at",
            "updated_at",
        )
        read_only_fields = fields

    def get_last_message(self, obj):
        last_message_id = getattr(obj, "last_message_id", None)
        if last_message_id:
            return {
                "id": last_message_id,
                "room": obj.id,
                "content": getattr(obj, "last_message_content", ""),
                "created_at": getattr(obj, "last_message_created_at", None),
                "updated_at": getattr(obj, "last_message_updated_at", None),
                "user": {
                    "email": getattr(obj, "last_message_user_email", None),
                    "username": getattr(obj, "last_message_username", None),
                },
            }
        return None

    def get_other_user(self, obj):
        request = self.context.get("request")
        if not request or request.user.is_anonymous:
            return None
        other_user = obj.guest if request.user == obj.host else obj.host
        return UserSerializer(other_user).data
