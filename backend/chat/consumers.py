import json

from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.db.models import Q
from redis.exceptions import RedisError

from .models import Message, Room


class ChatConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.user = self.scope["user"]

        if self.user.is_anonymous:
            await self.close()
            return

        self.room_id = self.scope["url_route"]["kwargs"]["room_id"]
        self.room_group_name = f"chat_{self.room_id}"

        if not await self.check_room_membership(self.room_id, self.user):
            await self.close()
            return

        try:
            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name,
            )
        except RedisError:
            await self.close(code=1011)
            return

        await self.accept()

    async def disconnect(self, close_code):
        if hasattr(self, "room_group_name"):
            try:
                await self.channel_layer.group_discard(
                    self.room_group_name,
                    self.channel_name,
                )
            except RedisError:
                # The client is already disconnecting; suppress noisy backend errors.
                return

    async def receive(self, text_data):
        data = json.loads(text_data)
        message_content = data["message"]

        await self.save_message(self.room_id, self.user, message_content)

        try:
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "chat_message",
                    "message": message_content,
                    "username": self.user.username,
                },
            )
        except RedisError:
            await self.close(code=1011)

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            "message": event["message"],
            "username": event["username"],
        }))

    @database_sync_to_async
    def check_room_membership(self, room_id, user):
        return Room.objects.filter(id=room_id).filter(
            Q(host=user) | Q(guest=user)
        ).exists()

    @database_sync_to_async
    def save_message(self, room_id, user, content):
        room = Room.objects.filter(
            Q(host=user) | Q(guest=user),
            id=room_id,
        ).get()
        Message.objects.create(room=room, user=user, content=content)
