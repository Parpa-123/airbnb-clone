from decimal import Decimal

from django.test import TestCase

from listings.models import Listings

from bookings.models import Bookings

from users.models import User

from rest_framework import status

from rest_framework.test import APIClient

from django.urls import reverse

CREATE_BOOKING_URL = reverse('bookings:booking-create')

RETRIVE_BOOKINGS_LIST = reverse('bookings:booking-list')

def detailed_booking_url(id):

    return reverse('bookings:booking-detail', args=[id])

def booking_detail_retrive(id):

    return reverse('bookings:booking-detail-retrieve', args=[id])

def booking_delete_url(id):

    return reverse('bookings:booking-delete', args=[id])

from datetime import timedelta
from django.utils import timezone

_now = timezone.now()
d0 = (_now + timedelta(days=9)).strftime("%Y-%m-%d")
d1 = (_now + timedelta(days=10)).strftime("%Y-%m-%d")
d2 = (_now + timedelta(days=15)).strftime("%Y-%m-%d")
d3 = (_now + timedelta(days=31)).strftime("%Y-%m-%d")
d4 = (_now + timedelta(days=35)).strftime("%Y-%m-%d")
d5 = (_now + timedelta(days=40)).strftime("%Y-%m-%d")
d6 = (_now + timedelta(days=45)).strftime("%Y-%m-%d")
d7 = (_now + timedelta(days=50)).strftime("%Y-%m-%d")
d8 = (_now + timedelta(days=55)).strftime("%Y-%m-%d")
d9 = (_now + timedelta(days=60)).strftime("%Y-%m-%d")
d10 = (_now + timedelta(days=65)).strftime("%Y-%m-%d")

class BookingTest(TestCase):

    def setUp(self):

        self.client = APIClient()

        self.user = User.objects.create_user(

            email='test@example.com',

            password='testpass123',

            username='testuser',

            phone='1234567890',

        )

        self.host = User.objects.create_host(

            email='host@example.com',

            password='hostpass123',

            username='hostuser',

            phone='1234567890',

        )

        self.client.force_authenticate(user=self.user)

    def create_sample_listing(self, user, address_suffix=""):

        return Listings.objects.create(

            host=user,

            title='Sample Listing',

            description='This is a sample listing for testing.',

            address=f'123 Sample Street {address_suffix}'.strip(),

            country='USA',

            city='New York',

            property_type='apartment',

            max_guests=4,

            bedrooms=2,

            beds=3,

            bathrooms=2.0,

            price_per_night=Decimal('100.00'),

            allows_children=True,

            allows_infants=True,

            allows_pets=True,

        )

    def test_failure_to_create_booking_on_own_property(self):

        listing = self.create_sample_listing(self.user)

        payload = {

                "listing": listing.id,

                "start_date": d1,

                "end_date": d2,

        }

        res = self.client.post(CREATE_BOOKING_URL, payload)

        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_booking_for_success(self):

        listing = self.create_sample_listing(self.host)

        payload = {

                "listing": listing.id,

                "start_date": d1,

                "end_date": d2,

        }

        res = self.client.post(CREATE_BOOKING_URL, payload)

        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

    def test_create_booking_with_invalid_params(self):

        listing = self.create_sample_listing(self.host)

        payload = {

                "listing": listing.id,

                "start_date": d1,

                "end_date": d0,

        }

        res = self.client.post(CREATE_BOOKING_URL, payload)

        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_no_creation_without_phone_number(self):

        user_no_phone = User.objects.create_user(

            email='nophone@example.com',

            password='testpass123',

            username='nophoneuser',

        )

        self.client.force_authenticate(user=user_no_phone)

        listing = self.create_sample_listing(self.host, "no-phone-test")

        payload = {

                "listing": listing.id,

                "start_date": d1,

                "end_date": d2,

        }

        res = self.client.post(CREATE_BOOKING_URL, payload)

        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

        self.client.force_authenticate(user=self.user)

    def test_booking_details(self):

        listing = self.create_sample_listing(self.host)

        booking = Bookings.objects.create(

            guest=self.user,

            listing=listing,

            start_date=d1,

            end_date=d2,

            total_price=Decimal("500.00"),

            status=Bookings.STATUS_CONFIRMED

        )

        res = self.client.get(detailed_booking_url(booking.id))

        self.assertEqual(res.status_code, status.HTTP_200_OK)

    def test_booking_detail_retrive(self):

        listing = self.create_sample_listing(self.host)

        booking = Bookings.objects.create(

            guest=self.user,

            listing=listing,

            start_date=d1,

            end_date=d2,

            total_price=Decimal("500.00"),

            status=Bookings.STATUS_CONFIRMED

        )

        res = self.client.get(booking_detail_retrive(booking.id))

        self.assertEqual(res.status_code, status.HTTP_200_OK)

    def test_booking_delete(self):

        listing = self.create_sample_listing(self.host)

        booking = Bookings.objects.create(

            guest=self.user,

            listing=listing,

            start_date=d1,

            end_date=d2,

            total_price=Decimal("500.00"),

            status=Bookings.STATUS_CONFIRMED

        )

        res = self.client.delete(booking_delete_url(booking.id))

        self.assertEqual(res.status_code, status.HTTP_204_NO_CONTENT)

    def test_booking_list(self):

        listing = self.create_sample_listing(self.host)

        booking = Bookings.objects.create(

            guest=self.user,

            listing=listing,

            start_date=d1,

            end_date=d2,

            total_price=Decimal("500.00"),

            status=Bookings.STATUS_CONFIRMED

        )

        res = self.client.get(RETRIVE_BOOKINGS_LIST)

        self.assertEqual(res.status_code, status.HTTP_200_OK)

    def test_shows_only_confirmed_bookings(self):

        listing1 = self.create_sample_listing(self.host, "A")

        listing2 = self.create_sample_listing(self.host, "B")

        booking1 = Bookings.objects.create(

            guest=self.user,

            listing=listing1,

            start_date=d1,

            end_date=d2,

            total_price=Decimal("500.00"),

            status=Bookings.STATUS_CONFIRMED

        )

        booking2 = Bookings.objects.create(

            guest=self.user,

            listing=listing2,

            start_date=d1,

            end_date=d2,

            total_price=Decimal("500.00"),

            status=Bookings.STATUS_PENDING

        )

        res = self.client.get(RETRIVE_BOOKINGS_LIST)

        self.assertEqual(res.status_code, status.HTTP_200_OK)

        self.assertEqual(res.data["count"], 1)
        self.assertEqual(len(res.data["results"]), 1)

        self.assertEqual(res.data["results"][0]['id'], booking1.id)

    def test_create_booking_with_guest_breakdown(self):

        listing = self.create_sample_listing(self.host)

        payload = {

            "listing": listing.id,

            "start_date": d3,

            "end_date": d4,

            "adults": 2,

            "children": 1,

            "infants": 1,

            "pets": 1,

        }

        res = self.client.post(CREATE_BOOKING_URL, payload)

        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

    def test_booking_fails_when_pets_not_allowed(self):

        listing = Listings.objects.create(

            host=self.host,

            title='No Pets Listing',

            description='Pets not allowed here.',

            address='456 No Pets Street',

            country='USA',

            city='Boston',

            property_type='apartment',

            max_guests=2,

            bedrooms=1,

            beds=1,

            bathrooms=1.0,

            price_per_night=Decimal('80.00'),

            allows_pets=False,

        )

        payload = {

            "listing": listing.id,

            "start_date": d5,

            "end_date": d6,

            "adults": 1,

            "pets": 1,

        }

        res = self.client.post(CREATE_BOOKING_URL, payload)

        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_booking_fails_when_children_not_allowed(self):

        listing = Listings.objects.create(

            host=self.host,

            title='Adults Only Listing',

            description='No children allowed.',

            address='789 Adults Only Ave',

            country='USA',

            city='Miami',

            property_type='apartment',

            max_guests=2,

            bedrooms=1,

            beds=1,

            bathrooms=1.0,

            price_per_night=Decimal('120.00'),

            allows_children=False,

        )

        payload = {

            "listing": listing.id,

            "start_date": d7,

            "end_date": d8,

            "adults": 1,

            "children": 2,

        }

        res = self.client.post(CREATE_BOOKING_URL, payload)

        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_booking_fails_when_adults_exceed_capacity(self):

        listing = self.create_sample_listing(self.host)

        payload = {

            "listing": listing.id,

            "start_date": d9,

            "end_date": d10,

            "adults": 6,

        }

        res = self.client.post(CREATE_BOOKING_URL, payload)

        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
