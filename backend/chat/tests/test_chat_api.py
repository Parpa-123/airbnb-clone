from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from django.test import TestCase

from chat.models import Message, Room
from listings.models import Listings
from users.models import User


ROOM_LIST_URL = reverse("chat:room-list")


def listing_room_url(listing_id):
    return reverse("chat:listing-room", args=[listing_id])


def message_list_url(room_id):
    return reverse("chat:message-list", args=[room_id])


def create_user(username):
    return User.objects.create_user(
        email=f"{username}@example.com",
        password="testpass123",
        username=username,
    )


def create_listing(host, title="Test Home", address="123 Main Street"):
    return Listings.objects.create(
        host=host,
        title=title,
        description="A comfortable place to stay.",
        address=address,
        country="India",
        city="Delhi",
        property_type="apartment",
        max_guests=2,
        bedrooms=1,
        beds=1,
        bathrooms=1,
        price_per_night=100,
    )


class PublicChatApiTests(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.host = create_user("host")
        self.listing = create_listing(self.host)

    def test_room_list_requires_auth(self):
        res = self.client.get(ROOM_LIST_URL)

        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_listing_room_create_requires_auth(self):
        res = self.client.post(listing_room_url(self.listing.id))

        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_message_list_requires_auth(self):
        res = self.client.get(message_list_url(1))

        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)


class PrivateChatRoomTests(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.host = create_user("host")
        self.guest = create_user("guest")
        self.other = create_user("other")
        self.listing = create_listing(self.host)
        self.client.force_authenticate(user=self.guest)

    def test_create_listing_room(self):
        res = self.client.post(listing_room_url(self.listing.id))

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data["listing"]["id"], self.listing.id)
        self.assertEqual(res.data["host"]["username"], self.host.username)
        self.assertEqual(res.data["guest"]["username"], self.guest.username)

        room = Room.objects.get(id=res.data["id"])
        self.assertEqual(room.listing, self.listing)
        self.assertEqual(room.host, self.host)
        self.assertEqual(room.guest, self.guest)
        self.assertIn(self.host, room.participants.all())
        self.assertIn(self.guest, room.participants.all())

    def test_create_listing_room_is_idempotent(self):
        first = self.client.post(listing_room_url(self.listing.id))
        second = self.client.post(listing_room_url(self.listing.id))

        self.assertEqual(first.status_code, status.HTTP_200_OK)
        self.assertEqual(second.status_code, status.HTTP_200_OK)
        self.assertEqual(first.data["id"], second.data["id"])
        self.assertEqual(Room.objects.count(), 1)

    def test_host_cannot_create_room_with_self(self):
        self.client.force_authenticate(user=self.host)

        res = self.client.post(listing_room_url(self.listing.id))

        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_list_rooms_only_shows_rooms_for_current_user(self):
        own_room = Room.objects.create(
            listing=self.listing,
            host=self.host,
            guest=self.guest,
        )
        other_room = Room.objects.create(
            listing=self.listing,
            host=self.host,
            guest=self.other,
        )

        res = self.client.get(ROOM_LIST_URL)

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data["count"], 1)
        self.assertEqual(len(res.data["results"]), 1)
        self.assertEqual(res.data["results"][0]["id"], own_room.id)
        self.assertNotEqual(res.data["results"][0]["id"], other_room.id)

    def test_room_response_includes_last_message(self):
        room = Room.objects.create(
            listing=self.listing,
            host=self.host,
            guest=self.guest,
        )
        Message.objects.create(room=room, user=self.guest, content="First msg")
        Message.objects.create(room=room, user=self.host, content="Latest msg")

        res = self.client.get(ROOM_LIST_URL)

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data["results"][0]["last_message"]["content"], "Latest msg")


class PrivateChatMessageTests(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.host = create_user("host")
        self.guest = create_user("guest")
        self.other = create_user("other")
        self.listing = create_listing(self.host)
        self.room = Room.objects.create(
            listing=self.listing,
            host=self.host,
            guest=self.guest,
        )
        self.client.force_authenticate(user=self.guest)

    def test_list_messages_in_own_room(self):
        Message.objects.create(room=self.room, user=self.guest, content="Hello")
        Message.objects.create(room=self.room, user=self.host, content="Hi there")

        res = self.client.get(message_list_url(self.room.id))

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data["count"], 2)
        self.assertEqual(len(res.data["results"]), 2)

    def test_host_can_list_messages_in_room(self):
        self.client.force_authenticate(user=self.host)
        Message.objects.create(room=self.room, user=self.guest, content="Hello")

        res = self.client.get(message_list_url(self.room.id))

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data["count"], 1)
        self.assertEqual(len(res.data["results"]), 1)

    def test_cannot_list_messages_in_other_room(self):
        self.client.force_authenticate(user=self.other)
        Message.objects.create(room=self.room, user=self.guest, content="Secret")

        res = self.client.get(message_list_url(self.room.id))

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data["count"], 0)
        self.assertEqual(len(res.data["results"]), 0)
