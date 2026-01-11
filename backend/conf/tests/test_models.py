from django.test import TestCase
from users.models import User
from listings.models import Listings, ListingImages, Amenities
from django.core.exceptions import ValidationError
from wishlist.models import Wishlist
from bookings.models import Bookings, Payment
from reviews.models import Review

class UserModelTest(TestCase):

    def test_create_user(self):
        """Test creating a new user using the imported User model."""

        email = "test@example.com"
        password = "testpass123"
        username = "testuser"

        user = User.objects.create_user(
            email=email,
            password=password,
            username=username
        )

        # Verify email is stored correctly
        self.assertEqual(user.email, email)

        # Verify password is hashed and correct
        self.assertTrue(user.check_password(password))
    
    def test_normalize_email(self):
        """Test normalizing the email address."""
        sample_emails = [
            ["test1@EXAMPLE.com", "test1@example.com"],
            ["Test2@Example.com", "Test2@example.com"],
            ["TEST3@EXAMPLE.COM", "TEST3@example.com"],
            ["test4@example.COM", "test4@example.com"],
        ]
        for idx, (i, j) in enumerate(sample_emails):
            # create_user expects (username, email, password)
            user = User.objects.create_user(username=f"user{idx}", email=i, password="sample123")
            self.assertEqual(user.email, j)

    def test_create_superuser(self):
        email = "test@example.com"
        password = "testpass123"
        username = "superuser"
        # create_superuser expects (username, email, password)
        user = User.objects.create_superuser(username=username, email=email, password=password)
        self.assertEqual(user.email, email)
        self.assertTrue(user.check_password(password))
        self.assertTrue(user.is_staff)
        self.assertTrue(user.is_superuser)

    def test_create_host(self):
        email = "host@example.com"
        password = "testpass123"
        username = "hostuser"
        # create_host expects (username, email, password)
        user = User.objects.create_host(username=username, email=email, password=password)
        self.assertEqual(user.email, email)
        self.assertTrue(user.check_password(password))
        self.assertTrue(user.is_host)

class ListingModelTest(TestCase):

    def test_create_properties(self):
        email = "host@example.com"
        password = "testpass123"
        username = "hostuser"
        # create_host expects (username, email, password)
        user = User.objects.create_host(username=username, email=email, password=password)
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

        self.assertEqual(str(listing),listing.title)

    def test_create_listing_images(self):
        email = "host@example.com"
        password = "testpass123"
        username = "hostuser"
        # create_host expects (username, email, password)
        user = User.objects.create_host(username=username, email=email, password=password)
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

        # CloudinaryField accepts string paths for testing
        # In production, it would be a file upload, but in tests we can use a path
        listing_image = ListingImages.objects.create(
            listings=listing,
            name="Sample Listing Image",
            image="test_image.jpg"  # CloudinaryField accepts strings in tests
        )

        self.assertEqual(str(listing_image),listing_image.name)

    def test_create_amenities(self):
        amenity = Amenities.objects.create(name="Wi-Fi")
        self.assertEqual(str(amenity),amenity.name)
    
class WishlistModelTest(TestCase):
    def test_create_wishlist(self):
        user = User.objects.create_user(username='testUser', email='test@example.com', password='testpass123')
        cite = Listings.objects.create(
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

        wishlist = Wishlist.objects.create(user=user, name="Sample Wishlist")

        self.assertEqual(str(wishlist),wishlist.name)


class BookingModelTest(TestCase):
    def test_create_booking(self):
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

        booking = Bookings.objects.create(guest=user, listing=listing, start_date="2023-01-01", end_date="2023-01-02", total_price=100.00)

        self.assertEqual(str(booking),f"{booking.guest.username} : {booking.listing.title}")
    
    def test_payment_model(self):
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

        booking = Bookings.objects.create(guest=user, listing=listing, start_date="2023-01-01", end_date="2023-01-02", total_price=100.00)

        payment = Payment.objects.create(booking=booking, amount=100.00, gateway="cashfree", order_id="test_order_id", payment_session_id="test_payment_session_id", transaction_id="test_transaction_id", status="paid")

        self.assertEqual(str(payment),f"{payment.booking.guest.username} : {payment.booking.listing.title} for {payment.booking.start_date} to {payment.booking.end_date}")

class ReviewModelTest(TestCase):
    def test_create_review(self):
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

        review = Review.objects.create(
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

        self.assertEqual(str(review),f"{review.review} - {review.listing.title} - {review.user.username}")


