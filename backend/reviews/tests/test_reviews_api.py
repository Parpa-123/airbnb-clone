from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from users.models import User
from listings.models import Listings
from bookings.models import Bookings
from reviews.models import Review

class ReviewAPITests(APITestCase):
    def setUp(self):
        self.host = User.objects.create_user(
            email="host@test.com", password="password123", username="host", is_host=True
        )
        self.guest = User.objects.create_user(
            email="guest@test.com", password="password123", username="guest"
        )
        self.other_user = User.objects.create_user(
            email="other@test.com", password="password123", username="other"
        )
        self.listing = Listings.objects.create(
            host=self.host,
            title="Test Listing",
            title_slug="test-listing",
            description="Test Description",
            price_per_night=100.00,
            max_guests=4,
            country="USA",
            city="Seattle",
            address="123 Test St",
            property_type="apartment",
            allows_pets=True,
            allows_children=True,
            bhk_choice="1",
            bed_choice="1",
            bathrooms=1,
        )
        self.booking = Bookings.objects.create(
            guest=self.guest,
            listing=self.listing,
            start_date="2026-10-01",
            end_date="2026-10-05",
            total_price=400.00,
            status=Bookings.STATUS_CONFIRMED,
        )
        self.url = reverse("reviews:review-list-create", kwargs={"title_slug": self.listing.title_slug})

    def test_list_reviews(self):
        Review.objects.create(
            user=self.guest,
            listing=self.listing,
            review="Great stay!",
            accuracy=5,
            communication=5,
            cleanliness=5,
            location=5,
            check_in=5,
            value=5,
        )
        res = self.client.get(self.url)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data['results']), 1)
        self.assertEqual(res.data['results'][0]['avg_rating'], 5)

    def test_create_review_success(self):
        self.client.force_authenticate(user=self.guest)
        payload = {
            "booking": self.booking.id,
            "review": "Nice place",
            "accuracy": 4,
            "communication": 4,
            "cleanliness": 4,
            "location": 4,
            "check_in": 4,
            "value": 4,
        }
        res = self.client.post(self.url, payload)
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Review.objects.count(), 1)

    def test_create_review_not_guest(self):
        self.client.force_authenticate(user=self.other_user)
        payload = {
            "booking": self.booking.id,
            "review": "Nice place",
            "accuracy": 4,
            "communication": 4,
            "cleanliness": 4,
            "location": 4,
            "check_in": 4,
            "value": 4,
        }
        res = self.client.post(self.url, payload)
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("You are not the guest", str(res.data))

    def test_create_review_unauthenticated(self):
        payload = {
            "booking": self.booking.id,
            "review": "Nice place",
            "accuracy": 4,
            "communication": 4,
            "cleanliness": 4,
            "location": 4,
            "check_in": 4,
            "value": 4,
        }
        res = self.client.post(self.url, payload)
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)
