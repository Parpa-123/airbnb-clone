from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from users.models import User
from rest_framework.test import APIClient

USER_API_URL = reverse('users:create')
USER_TOKEN_URL = reverse('users:token_obtain_pair')
USER_SELF_URL = reverse('users:me')

def create_user(**params):
    return User.objects.create_user(**params)

class PublicUserApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()
    
    def test_create_user_success(self):
        payload = {
            'email': 'test@example.com',
            'password': 'testpass123',
            'username': 'testuser',
        }
        res = self.client.post(USER_API_URL, payload)
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        user = User.objects.get(email=payload['email'])
        self.assertTrue(user.check_password(payload['password']))
        self.assertNotIn('password',res.data)

    def test_creation_with_same_email_returns_error(self):
        payload = {
            'email': 'test@example.com',
            'password': 'testpass123',
            'username': 'testuser',
        }

        create_user(**payload)
        res = self.client.post(USER_API_URL, payload)

        self.assertEqual(res.status_code,status.HTTP_400_BAD_REQUEST)

    def test_pswd_too_short(self):
        """Test that password shorter than 8 characters is rejected"""
        payload = {
            'email': 'test@example.com',
            'password': 'short1',
            'username': 'testuser',
        }

        res = self.client.post(USER_API_URL, payload)

        self.assertEqual(res.status_code,status.HTTP_400_BAD_REQUEST)
        db_state = User.objects.filter(email=payload['email']).exists()
        self.assertFalse(db_state)
    
    def test_token_fetch(self):
        user_data = {
            'email': 'test@example.com',
            'password': 'testpass123',
            'username': 'testuser',
        }
        create_user(**user_data)
        
        # Login using username, not email
        login_payload = {
            'username': 'testuser',
            'password': 'testpass123',
        }
        res = self.client.post(USER_TOKEN_URL, login_payload)

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn('access', res.data)
        self.assertIn('refresh', res.data)

    def test_token_fetch_failure_on_no_pswd(self):
        """Test that token fetch fails with empty password"""
        user_data = {
            'email': 'test@example.com',
            'password': 'testpass123',
            'username': 'testuser',
        }
        create_user(**user_data)
        
        # Try to login with empty password using username
        login_payload = {
            'username': 'testuser',
            'password': '',
        }
        res = self.client.post(USER_TOKEN_URL, login_payload)

        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertNotIn('access', res.data)

    def test_token_fetch_with_wrong_username(self):
        """Test that token fetch fails with non-existent username"""
        user_data = {
            'email': 'test@example.com',
            'password': 'testpass123',
            'username': 'testuser',
        }
        create_user(**user_data)
        
        # Try to login with wrong username
        login_payload = {
            'username': 'wronguser',
            'password': 'testpass123',
        }
        res = self.client.post(USER_TOKEN_URL, login_payload)

        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_retriving_self_not_allowed(self):

        res = self.client.get(USER_SELF_URL)

        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

class PrivateUserApiTests(TestCase):

    def setUp(self):
        self.testUser = create_user(
            username = 'TestUser',
            password = 'testpass123',
            email='test@example.com',
            phone='+1234567890',
        )

        self.client = APIClient()

        self.client.force_authenticate(user=self.testUser)

    def test_fetching_data(self):
    
        res = self.client.get(USER_SELF_URL)

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['username'], self.testUser.username)
        self.assertEqual(res.data['email'], self.testUser.email)
        self.assertIn('phone', res.data)
        self.assertIn('avatar', res.data)
        self.assertNotIn('password', res.data)


    def test_post_on_self_not_allowed(self):

        res = self.client.post(USER_SELF_URL,{})

        self.assertEqual(res.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_update_on_self(self):
        """Test updating user profile (password only, phone is optional)"""
        payload = {
            'password' : 'newpass123',
        }

        res = self.client.patch(USER_SELF_URL,payload)

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.testUser.refresh_from_db()

        # Username and email should remain unchanged (read-only)
        self.assertEqual(self.testUser.username, 'TestUser')
        self.assertEqual(self.testUser.email, 'test@example.com')
        # Password should be updated
        self.assertTrue(self.testUser.check_password(payload['password']))
