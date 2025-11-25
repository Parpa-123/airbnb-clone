from decimal import Decimal
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

from users.models import User
from cities_light.models import City, Country
from listings.models import Listings
from listings.serializers import ListingSerializer

LIST_API_URL = reverse('listing:listings-list')


def create_estate(user, params=None):
    """Helper function to create a listing."""
    if params is None:
        params = {}

    # Get or create cities_light Country
    country_obj, _ = Country.objects.get_or_create(
        code2="IN",
        defaults={
            "code3": "IND",
            "name": "India",
        }
    )

    # Get or create City
    city_obj, _ = City.objects.get_or_create(
        name="Mumbai",
        country=country_obj
    )

    default = {
        "title": "Sea View Apartment",
        "description": "Beautiful apartment overlooking the sea with modern interiors.",
        "address": "Marine Drive, Mumbai",

        # Listings.country expects a string code ("IN"), not a Country instance
        "country": "IN",

        # Listings.city expects a City FK
        "city": city_obj,

        "property_type": "apartment",
        "max_guests": 4,
        "bhk_choice": 2,
        "bed_choice": 3,
        "bathrooms": 2.0,
        "price": Decimal("199.99"),
        "price_per_night": Decimal("59.99"),
    }

    default.update(params)

    return Listings.objects.create(host=user, **default)



class PublicListingsTest(TestCase):
    """Tests for public (unauthenticated) API access."""

    def setUp(self):
        self.client = APIClient()

    def test_auth_required(self):
        res = self.client.get(LIST_API_URL)
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)


class PrivateListingsTest(TestCase):
    """Tests for authenticated user listing API."""

    def setUp(self):
        self.client = APIClient()
        self.testuser = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            username='testuser',
        )
        self.client.force_authenticate(user=self.testuser)

    def test_retrieving_list(self):
        create_estate(user=self.testuser)
        create_estate(user=self.testuser)

        res = self.client.get(LIST_API_URL)
        estates = Listings.objects.all().order_by('-id')

        self.assertEqual(res.status_code, status.HTTP_200_OK)

        serializer = ListingSerializer(estates, many=True)
        self.assertEqual(res.data, serializer.data)

    def test_retrieving_self_list(self):
        other_user = User.objects.create_user(
            email='test2@example.com',
            password='testpass123',
            username='testuser2',
        )

        create_estate(user=other_user)
        create_estate(user=self.testuser)

        res = self.client.get(LIST_API_URL)

        self_estates = Listings.objects.filter(host=self.testuser).order_by('-id')
        serializer = ListingSerializer(self_estates, many=True)

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, serializer.data)
