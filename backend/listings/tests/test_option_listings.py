from django.test import TestCase

from rest_framework import status

from rest_framework.test import APIClient

from django.urls import reverse

from users.models import User

OPTIONS_URL = reverse("listing:form-options")

class OptionHandlingTest(TestCase):

    def setUp(self):

        self.client = APIClient()

        self.testuser = User.objects.create_user(

            email='test@example.com',

            password='testpass123',

            username='testuser',

        )

        self.client.force_authenticate(user=self.testuser)

    def test_retriving_options(self):

        res = self.client.get(OPTIONS_URL)

        self.assertEqual(res.status_code, status.HTTP_200_OK)
