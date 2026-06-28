from django.db import IntegrityError
from django.test import TestCase

from chat.models import Message, Room
from listings.models import Listings
from users.models import User


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


class RoomModelTest(TestCase):

    def setUp(self):
        self.host = create_user("host")
        self.guest = create_user("guest")
        self.listing = create_listing(self.host)

    def test_create_listing_room(self):
        room = Room.objects.create(
            listing=self.listing,
            host=self.host,
            guest=self.guest,
        )
        room.sync_participants()

        self.assertEqual(room.listing, self.listing)
        self.assertEqual(room.host, self.host)
        self.assertEqual(room.guest, self.guest)
        self.assertEqual(room.participants.count(), 2)
        self.assertIn(self.host, room.participants.all())
        self.assertIn(self.guest, room.participants.all())

    def test_room_str_uses_listing_context(self):
        room = Room.objects.create(
            listing=self.listing,
            host=self.host,
            guest=self.guest,
        )

        self.assertEqual(str(room), "Test Home chat")

    def test_unique_room_per_listing_host_guest(self):
        Room.objects.create(listing=self.listing, host=self.host, guest=self.guest)

        with self.assertRaises(IntegrityError):
            Room.objects.create(listing=self.listing, host=self.host, guest=self.guest)

    def test_same_pair_can_chat_about_different_listings(self):
        second_listing = create_listing(
            self.host,
            title="Second Home",
            address="456 Side Street",
        )

        Room.objects.create(listing=self.listing, host=self.host, guest=self.guest)
        Room.objects.create(listing=second_listing, host=self.host, guest=self.guest)

        self.assertEqual(Room.objects.count(), 2)

    def test_room_ordering(self):
        room1 = Room.objects.create(listing=self.listing, host=self.host, guest=self.guest)
        second_guest = create_user("secondguest")
        room2 = Room.objects.create(listing=self.listing, host=self.host, guest=second_guest)

        rooms = list(Room.objects.all())

        self.assertEqual(rooms[0], room2)
        self.assertEqual(rooms[1], room1)


class MessageModelTest(TestCase):

    def setUp(self):
        self.host = create_user("host")
        self.guest = create_user("guest")
        self.listing = create_listing(self.host)
        self.room = Room.objects.create(
            listing=self.listing,
            host=self.host,
            guest=self.guest,
        )

    def test_create_message(self):
        message = Message.objects.create(
            room=self.room,
            user=self.guest,
            content="Hello, world!",
        )

        self.assertEqual(message.content, "Hello, world!")
        self.assertEqual(message.user, self.guest)
        self.assertEqual(message.room, self.room)

    def test_message_ordering(self):
        msg1 = Message.objects.create(room=self.room, user=self.guest, content="First")
        msg2 = Message.objects.create(room=self.room, user=self.host, content="Second")

        messages = list(Message.objects.all())

        self.assertEqual(messages[0], msg1)
        self.assertEqual(messages[1], msg2)

    def test_cascade_delete_room_deletes_messages(self):
        Message.objects.create(room=self.room, user=self.guest, content="Soon gone")

        self.assertEqual(Message.objects.count(), 1)

        self.room.delete()

        self.assertEqual(Message.objects.count(), 0)
