from django.test import TestCase
from users.models import User

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
            user = User.objects.create_user(i, "sample123", username=f"user{idx}")
            self.assertEqual(user.email, j)

    def test_create_superuser(self):
        email = "test@example.com"
        password = "testpass123"
        username = "superuser"
        user = User.objects.create_superuser(email, password, username=username)
        self.assertEqual(user.email, email)
        self.assertTrue(user.check_password(password))
        self.assertTrue(user.is_staff)
        self.assertTrue(user.is_superuser)

    def test_create_host(self):
        email = "host@example.com"
        password = "testpass123"
        username = "hostuser"
        user = User.objects.create_host(email, password, username=username)
        self.assertEqual(user.email, email)
        self.assertTrue(user.check_password(password))
        self.assertTrue(user.is_host)
