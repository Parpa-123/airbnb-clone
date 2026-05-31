from django.db import models

from django.conf import settings
from django.db.models import F, Q

from listings.models import Listings
from users.base_models import TimeStampedModel


class Room(TimeStampedModel):

    name = models.CharField(max_length=255, blank=True)

    listing = models.ForeignKey(
        Listings,
        on_delete=models.CASCADE,
        related_name="chat_rooms",
    )

    host = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="host_chat_rooms",
    )

    guest = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="guest_chat_rooms",
    )

    participants = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name="chat_rooms",
        blank=True,
    )

    def __str__(self):
        return self.name or f"{self.listing.title}: {self.guest} to {self.host}"

    def save(self, *args, **kwargs):
        if not self.name:
            self.name = f"{self.listing.title} chat"
        super().save(*args, **kwargs)

    def sync_participants(self):
        self.participants.set([self.host, self.guest])

    class Meta:
        verbose_name = "Room"
        verbose_name_plural = "Rooms"
        ordering = ["-created_at"]
        constraints = [
            models.UniqueConstraint(
                fields=["listing", "host", "guest"],
                name="unique_listing_host_guest_room",
            ),
            models.CheckConstraint(
                check=~Q(host_id=F("guest_id")),
                name="room_host_guest_must_differ",
            ),
        ]


class Message(TimeStampedModel):

    room = models.ForeignKey(
        Room,
        on_delete=models.CASCADE,
        related_name="messages",
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="chat_messages",
    )

    content = models.TextField()

    def __str__(self):
        return f"{self.user} in {self.room}: {self.content[:50]}"

    class Meta:
        verbose_name = "Message"
        verbose_name_plural = "Messages"
        ordering = ["created_at"]
