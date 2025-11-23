from django.test import TestCase, Client
from users.models import User
from django.urls import reverse

class AdminSiteTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.admin_user = User.objects.create_superuser(
            email="admin@example.com",
            password="testpass123",
            username="adminuser",
        )

        # Login as admin user for Django admin
        self.client.login(username=self.admin_user.username, password="testpass123")

        self.user = User.objects.create_user(
            email="user@example.com",
            password="testpass123",
            username="useruser",
        )

    def test_users_listed(self):
        url = reverse("admin:users_user_changelist")
        res = self.client.get(url)
        self.assertContains(res, self.user.username)
        self.assertContains(res, self.user.email)

    def test_user_change_page(self):
        url = reverse("admin:users_user_change", args=[self.user.id])
        res = self.client.get(url)
        self.assertEqual(res.status_code, 200)

    def test_user_add_page(self):
        url = reverse("admin:users_user_add")
        res = self.client.get(url)
        self.assertEqual(res.status_code, 200)