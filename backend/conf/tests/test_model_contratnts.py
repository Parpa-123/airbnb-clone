from django.test import TestCase

from listings.models import Listings

from users.models import User

from bookings.models import Bookings

from wishlist.models import Wishlist

from reviews.models import Review

from listings.models import ListingImages

from listings.models import Amenities

from django.db import IntegrityError

from django.core.exceptions import ValidationError

class ListingsConstraintTest(TestCase):

    def test_unique_host_address(self):

        user = User.objects.create_user(username='testUser', email='test@example.com', password='testpass123')

        Listings.objects.create(

            host=user,

            title="Sample Listing Title",

            description="This is a sample description for testing the Listings model.",

            address="123 Test Street",

            country="IN",

            city="Mumbai",

            property_type="apartment",

            max_guests=4,

            bhk_choice=2,

            bed_choice=3,

            bathrooms=2.0,

            price_per_night=59.99

        )

        with self.assertRaises(IntegrityError):

            Listings.objects.create(

            host=user,

            title="Sample Listing Title",

            description="This is a sample description for testing the Listings model.",

            address="123 Test Street",

            country="IN",

            city="Mumbai",

            property_type="apartment",

            max_guests=4,

            bhk_choice=2,

            bed_choice=3,

            bathrooms=2.0,

            price_per_night=59.99

        )

    def test_price_per_night_must_be_positive(self):

        user = User.objects.create_user(username='testUser', email='test@example.com', password='testpass123')

        with self.assertRaises(IntegrityError):

            Listings.objects.create(

            host=user,

            title="Sample Listing Title",

            description="This is a sample description for testing the Listings model.",

            address="123 Test Street",

            country="IN",

            city="Mumbai",

            property_type="apartment",

            max_guests=4,

            bhk_choice=2,

            bed_choice=3,

            bathrooms=2.0,

            price_per_night=-59.99

        )

class BookingsConstraintsTest(TestCase):

    def test_start_date_must_be_before_end_date(self):

        user = User.objects.create_user(username='testUser', email='test@example.com', password='testpass123')

        listing = Listings.objects.create(

            host=user,

            title="Sample Listing Title",

            description="This is a sample description for testing the Listings model.",

            address="123 Test Street",

            country="IN",

            city="Mumbai",

            property_type="apartment",

            max_guests=4,

            bhk_choice=2,

            bed_choice=3,

            bathrooms=2.0,

            price_per_night=59.99

        )

        with self.assertRaises(IntegrityError):

            Bookings.objects.create(

                guest=user,

                listing=listing,

                start_date="2026-01-05",

                end_date="2026-01-01",

                total_price=100.00

            )

class WishlistConstraintsTest(TestCase):

    def test_unique_wishlist_name_per_user(self):

        user = User.objects.create_user(username='testUser', email='test@example.com', password='testpass123')

        Wishlist.objects.create(user=user, name="My Favorites")

        with self.assertRaises(IntegrityError):

            Wishlist.objects.create(user=user, name="My Favorites")

class ReviewConstraintsTest(TestCase):

    def test_unique_review_per_listing_and_user(self):

        user = User.objects.create_user(username='testUser', email='test@example.com', password='testpass123')

        listing = Listings.objects.create(

            host=user,

            title="Sample Listing Title",

            description="This is a sample description for testing the Listings model.",

            address="123 Test Street",

            country="IN",

            city="Mumbai",

            property_type="apartment",

            max_guests=4,

            bhk_choice=2,

            bed_choice=3,

            bathrooms=2.0,

            price_per_night=59.99

        )

        Review.objects.create(

            review="Great place!",

            accuracy=4,

            communication=5,

            cleanliness=4,

            location=5,

            check_in=5,

            value=4,

            listing=listing,

            user=user

        )

        with self.assertRaises(IntegrityError):

            Review.objects.create(

                review="Great place!",

                accuracy=4,

                communication=5,

                cleanliness=4,

                location=5,

                check_in=5,

                value=4,

                listing=listing,

                user=user

            )
