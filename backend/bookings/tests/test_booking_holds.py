from datetime import timedelta
from decimal import Decimal

from django.test import TestCase
from django.urls import reverse
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APIClient

from bookings.models import Bookings
from listings.models import Listings
from users.models import User


CREATE_BOOKING_URL = reverse("bookings:booking-create")
CREATE_ORDER_URL = reverse("bookings:payment-create-order")


class BookingHoldTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.host = User.objects.create_host(
            email="host@example.com",
            password="hostpass123",
            username="hostuser",
            phone="1234567890",
        )
        self.guest_one = User.objects.create_user(
            email="guest1@example.com",
            password="guestpass123",
            username="guestone",
            phone="1234567890",
        )
        self.guest_two = User.objects.create_user(
            email="guest2@example.com",
            password="guestpass123",
            username="guesttwo",
            phone="1234567890",
        )
        self.listing = Listings.objects.create(
            host=self.host,
            title="Hold Listing",
            description="Concurrency hold test listing",
            address="111 Hold Street",
            country="USA",
            city="Austin",
            property_type="apartment",
            max_guests=4,
            bhk_choice=2,
            bed_choice=2,
            bathrooms=2.0,
            price_per_night=Decimal("120.00"),
            allows_children=True,
            allows_infants=True,
            allows_pets=True,
        )
        self.start_date_obj = timezone.now().date() + timedelta(days=20)
        self.end_date_obj = timezone.now().date() + timedelta(days=23)
        self.start_date = self.start_date_obj.isoformat()
        self.end_date = self.end_date_obj.isoformat()

    def test_active_pending_hold_blocks_other_guest(self):
        self.client.force_authenticate(self.guest_one)
        first = self.client.post(
            CREATE_BOOKING_URL,
            {
                "listing": self.listing.id,
                "start_date": self.start_date,
                "end_date": self.end_date,
            },
        )
        self.assertEqual(first.status_code, status.HTTP_201_CREATED)

        self.client.force_authenticate(self.guest_two)
        second = self.client.post(
            CREATE_BOOKING_URL,
            {
                "listing": self.listing.id,
                "start_date": self.start_date,
                "end_date": self.end_date,
            },
        )
        self.assertEqual(second.status_code, status.HTTP_400_BAD_REQUEST)

    def test_expired_pending_hold_does_not_block(self):
        Bookings.objects.create(
            guest=self.guest_one,
            listing=self.listing,
            start_date=self.start_date_obj,
            end_date=self.end_date_obj,
            total_price=Decimal("360.00"),
            status=Bookings.STATUS_PENDING,
            hold_expires_at=timezone.now() - timedelta(minutes=1),
        )

        self.client.force_authenticate(self.guest_two)
        res = self.client.post(
            CREATE_BOOKING_URL,
            {
                "listing": self.listing.id,
                "start_date": self.start_date,
                "end_date": self.end_date,
            },
        )
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

    def test_create_order_rejects_expired_hold_and_cancels_booking(self):
        booking = Bookings.objects.create(
            guest=self.guest_one,
            listing=self.listing,
            start_date=self.start_date_obj,
            end_date=self.end_date_obj,
            total_price=Decimal("360.00"),
            status=Bookings.STATUS_PENDING,
            hold_expires_at=timezone.now() - timedelta(minutes=1),
        )
        self.client.force_authenticate(self.guest_one)

        res = self.client.post(CREATE_ORDER_URL, {"booking_id": booking.id}, format="json")
        self.assertEqual(res.status_code, status.HTTP_409_CONFLICT)

        booking.refresh_from_db()
        self.assertEqual(booking.status, Bookings.STATUS_CANCELLED)
