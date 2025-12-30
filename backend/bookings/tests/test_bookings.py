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



class BookingTest(TestCase):
    """Test for booking API."""

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            username='testuser',
        )
        # Create a separate host user for listings
        self.host = User.objects.create_host(
            email='host@example.com',
            password='hostpass123',
            username='hostuser',
        )
        self.client.force_authenticate(user=self.user)
    
    def create_sample_listing(self, user):
        return Listings.objects.create(
            host=user,
            title='Sample Listing',
            description='This is a sample listing for testing.',
            address='123 Sample Street',
            country='USA',
            city='New York',
            property_type='apartment',
            max_guests=4,
            bhk_choice=2,
            bed_choice=3,
            bathrooms=2.0,
            price_per_night=Decimal('100.00'),
        )

    def test_failure_to_create_booking_on_own_property(self):
        """Test Failure to Create Booking on Own Property"""
        listing = self.create_sample_listing(self.user)

        payload = {
                "listing": listing.id,
                "start_date": "2026-01-10",
                "end_date": "2026-01-15",
        }

        res = self.client.post(CREATE_BOOKING_URL, payload)
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_booking_for_success(self):
        """Test Creating Booking"""
        # Use host user for listing so guest can book it
        listing = self.create_sample_listing(self.host)

        payload = {
                "listing": listing.id,
                "start_date": "2026-01-10",
                "end_date": "2026-01-15",
        }

        res = self.client.post(CREATE_BOOKING_URL, payload)
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        
        
    def test_create_booking_with_invalid_params(self):
        """Test Creating Booking with invalid params (end date before start date)"""
        listing = self.create_sample_listing(self.host)

        payload = {
                "listing": listing.id,
                "start_date": "2026-01-10",
                "end_date": "2026-01-09",  # Invalid: before start date
        }

        res = self.client.post(CREATE_BOOKING_URL, payload)
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        
    
    def test_booking_details(self):
        """Test Booking Details"""
        listing = self.create_sample_listing(self.host)
        booking = Bookings.objects.create(
            guest=self.user,
            listing=listing,
            start_date="2026-01-10",
            end_date="2026-01-15",
            total_price=Decimal("500.00"),
            status=Bookings.STATUS_CONFIRMED
        )

        res = self.client.get(detailed_booking_url(booking.id))
        self.assertEqual(res.status_code, status.HTTP_200_OK)

    def test_booking_detail_retrive(self):
        """Test Booking Detail Retrieve"""
        listing = self.create_sample_listing(self.host)
        booking = Bookings.objects.create(
            guest=self.user,
            listing=listing,
            start_date="2026-01-10",
            end_date="2026-01-15",
            total_price=Decimal("500.00"),
            status=Bookings.STATUS_CONFIRMED
        )

        res = self.client.get(booking_detail_retrive(booking.id))
        self.assertEqual(res.status_code, status.HTTP_200_OK)

    def test_booking_delete(self):
        """Test Booking Delete"""
        listing = self.create_sample_listing(self.host)
        booking = Bookings.objects.create(
            guest=self.user,
            listing=listing,
            start_date="2026-01-10",
            end_date="2026-01-15",
            total_price=Decimal("500.00"),
            status=Bookings.STATUS_CONFIRMED
        )

        res = self.client.delete(booking_delete_url(booking.id))
        self.assertEqual(res.status_code, status.HTTP_204_NO_CONTENT)
    
    def test_booking_list(self):
        """Test Booking List"""
        listing = self.create_sample_listing(self.host)
        booking = Bookings.objects.create(
            guest=self.user,
            listing=listing,
            start_date="2026-01-10",
            end_date="2026-01-15",
            total_price=Decimal("500.00"),
            status=Bookings.STATUS_CONFIRMED
        )

        res = self.client.get(RETRIVE_BOOKINGS_LIST)
        self.assertEqual(res.status_code, status.HTTP_200_OK)

    def test_shows_only_confirmed_bookings(self):
        """Test Booking List"""
        listing1 = self.create_sample_listing(self.host)
        listing2 = self.create_sample_listing(self.host)
        booking1 = Bookings.objects.create(
            guest=self.user,
            listing=listing1,
            start_date="2026-01-10",
            end_date="2026-01-15",
            total_price=Decimal("500.00"),
            status=Bookings.STATUS_CONFIRMED
        )
        booking2 = Bookings.objects.create(
            guest=self.user,
            listing=listing2,
            start_date="2026-01-10",
            end_date="2026-01-15",
            total_price=Decimal("500.00"),
            status=Bookings.STATUS_PENDING
        )

        res = self.client.get(RETRIVE_BOOKINGS_LIST)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data), 1)
        self.assertEqual(res.data[0]['id'], booking1.id)