from django.test import TestCase

from rest_framework.test import APIClient

from rest_framework import status

from django.urls import reverse

from wishlist.models import Wishlist

from users.models import User

from listings.models import Listings

WISHLIST_URL = reverse("wishlist:wishlist-list")

BULK_ADD_TO_WISHLIST_URL = reverse("wishlist:bulk-add-to-wishlist")

def listings_in_wishlist_url(wishlist_id):

    return reverse("wishlist:wishlist-detail", kwargs={"slug": wishlist_id})

def delete_listing_from_wishlist_url(wishlist_id, listing_id):

    return reverse("wishlist:delete-listing-from-wishlist", kwargs={"slug": wishlist_id, "title_slug": listing_id})

class WishlistTestCase(TestCase):

    def setUp(self):

        self.client = APIClient()

        self.user = User.objects.create_user(

            username='testuser',

            password='testpassword',

            email='testuser@example.com'

        )

        self.client.force_authenticate(user=self.user)

        self.wishlist = Wishlist.objects.create(

            user=self.user,

            name="Test Wishlist"

        )

        self.listing = Listings.objects.create(

            host=self.user,

            title="Test Listing",

            description="Test Description",

            address="123 Test St",

            country="USA",

            city="Test City",

            property_type="apartment",

            max_guests=4,

            bhk_choice=2,

            bed_choice=2,

            bathrooms=1.0,

            price_per_night=100.00

        )

    def test_fetch_wishlist(self):

        response = self.client.get(WISHLIST_URL)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_post_wishlist(self):

        response = self.client.post(WISHLIST_URL, {"name": "Test Wishlist-2"})

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_listings_in_wishlist(self):

        response = self.client.get(listings_in_wishlist_url(self.wishlist.slug))

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_bulk_add_to_wishlist(self):

        response = self.client.post(BULK_ADD_TO_WISHLIST_URL, {"listing": self.listing.title_slug, "wishlist": [self.wishlist.slug]})

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_listing_from_wishlist(self):

        self.wishlist.listings.add(self.listing)

        response = self.client.delete(listings_in_wishlist_url(self.wishlist.slug))

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_delete_listing_from_wishlist_not_found(self):

        self.wishlist.listings.add(self.listing)

        response = self.client.delete(delete_listing_from_wishlist_url(self.wishlist.slug, self.listing.title_slug))

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
