from decimal import Decimal
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
import base64

from users.models import User
from listings.models import Listings, ListingImages, Amenities
from listings.serializers import ListingSerializer, ListingDetailSerializer
from django.core.exceptions import ValidationError

LIST_API_URL = reverse('listing:listings-list')
PUBLIC_LISTING_URL = reverse('listing:public-listings')


def detailed_list_url(title_slug):
    return reverse('listing:property-details', args=[title_slug])


def create_estate(user, params={}):
    """Helper function to create a listing."""
    

    default = {
        "title": "Sea View Apartment",
        "description": "Beautiful apartment overlooking the sea with modern interiors.",
        "address": "Marine Drive, Mumbai",
        "country": "India",
        "city": "Mumbai",
        "property_type": "apartment",
        "max_guests": 4,
        "bhk_choice": 2,
        "bed_choice": 3,
        "bathrooms": 2.0,
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

    def test_detailed_description(self):
        """Test retrieving detailed property information without authentication."""
        # Create a test user and property
        testuser = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            username='testuser',
        )
        property_dets = create_estate(user=testuser)

        # Use title_slug instead of id since the URL expects a slug
        res = self.client.get(detailed_list_url(property_dets.title_slug))

        serialized_data = ListingDetailSerializer(property_dets).data
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(serialized_data, res.data)

    def test_public_listings(self):
        testuser = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            username='testuser',
        )
        create_estate(user=testuser)
        
        testotheruser = User.objects.create_user(
            email='test2@example.com',
            password='testpass123',
            username='testuser2',
        )
        create_estate(user=testotheruser)

        res = self.client.get(PUBLIC_LISTING_URL)

        estate = Listings.objects.all().order_by('-id')
        serializer = ListingSerializer(estate, many=True)

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, serializer.data)


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

    def test_becoming_host(self):
        create_estate(user=self.testuser)
        self.testuser.refresh_from_db()
        self.assertTrue(self.testuser.is_host)

    def test_retrieving_list(self):
        create_estate(user=self.testuser)
        create_estate(user=self.testuser)

        res = self.client.get(LIST_API_URL)
        estates = Listings.objects.all().order_by('-id')

        self.assertEqual(res.status_code, status.HTTP_200_OK)

        serializer = ListingSerializer(estates, many=True)
        self.assertEqual(res.data, serializer.data)

    def test_retrieving_self_list(self):
        other_user = User.objects.create_host(
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




    def test_unable_to_create_estate_with_invalid_params(self):
        """Test that estate creation fails with invalid parameters"""
        invalid_params = {
            "title": "Invalid Estate",
            "description": "Invalid description",
            "address": "Invalid address",
            "country": "Invalid country",
            "city": "Invalid city",
            "property_type": "Invalid property type",
            "max_guests": -1,
            "bhk_choice": -1,
            "bed_choice": -1,
            "bathrooms": -1,
            "price_per_night": -1,
        }
        
        res = self.client.post(LIST_API_URL, invalid_params)

        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_listing_with_base64_images(self):
        """Test creating a listing with base64 encoded images"""
        # Create a minimal 1x1 PNG image in base64
        # This is a valid 1x1 transparent PNG
        tiny_png_base64 = (
            "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
        )
        
        # Create the data URL format
        image_data_url = f"data:image/png;base64,{tiny_png_base64}"
        
        valid_params = {
            "title": "Beach House with Images",
            "description": "Beautiful beach house with ocean views",
            "address": "456 Ocean Drive",
            "country": "India",
            "city": "Goa",
            "property_type": "house",
            "max_guests": 6,
            "bhk_choice": 3,
            "bed_choice": 4,
            "bathrooms": 2.0,
            "price_per_night": "200.50",
            "images": [
                {
                    "name": "front_view",
                    "image_data": image_data_url
                },
                {
                    "name": "back_view",
                    "image_data": image_data_url
                }
            ]
        }
        
        res = self.client.post(LIST_API_URL, valid_params, format='json')
        
        # Verify listing was created
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        
        # Verify listing exists
        listing = Listings.objects.filter(title="Beach House with Images").first()
        self.assertIsNotNone(listing)
        
        # Verify images were created
        images = ListingImages.objects.filter(listings=listing)
        self.assertEqual(images.count(), 2)
        
        # Verify image names
        image_names = [img.name for img in images]
        self.assertIn("front_view", image_names)
        self.assertIn("back_view", image_names)

    def test_create_amenities(self):
        amenities = Amenities.objects.create(name="Wi-Fi")
        self.assertEqual(str(amenities),amenities.name)
    
    