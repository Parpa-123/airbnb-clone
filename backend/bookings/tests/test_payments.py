import base64

import hashlib

import hmac

def generate_cashfree_signature(secret, timestamp, raw_body:bytes):

    signed_payload = timestamp + raw_body.decode("utf-8")

    computed_hmac = hmac.new(

        secret.encode(),

        signed_payload.encode(),

        hashlib.sha256

    ).digest()

    expected_signature = base64.b64encode(computed_hmac).decode()

    return expected_signature

import json

from django.urls import reverse

from django.conf import settings

from rest_framework.test import APIClient

from django.test import TestCase

from bookings.models import Payment, Bookings
from django.utils import timezone
from datetime import timedelta

from users.models import User

from listings.models import Listings

from decimal import Decimal

class PaymentTest(TestCase):

    def setUp(self):

        self.client = APIClient()

        self.user = User.objects.create_user(

            username="testuser",

            password="testpassword",

            email="testuser@example.com",

        )

        self.host = User.objects.create_host(

            username="testhost",

            password="testpassword",

            email="testhost@example.com",

        )

        self.listing = Listings.objects.create(

            host=self.host,

            title='Sample Listing',

            description='This is a sample listing for testing.',

            address='123 Payment Test Street',

            country='USA',

            city='New York',

            property_type='apartment',

            max_guests=4,

            bedrooms=2,

            beds=3,

            bathrooms=2.0,

            price_per_night=Decimal('100.00'),

            allows_children=True,

            allows_infants=True,

            allows_pets=True,

        )

        self.url = reverse("bookings:cashfree-webhook")

        self.timestamp = "1756666666"

        self.payload = {

            "type" : "PAYMENT_SUCCESS",

            "data" : {

                "order":{'order_id':'order_123456789'},

                "payment" : {'cf_payment_id':'cf_123456789'}

            }

        }

        self.raw_body = json.dumps(self.payload).encode("utf-8")

        self.signature = generate_cashfree_signature(

            settings.CASHFREE_SECRET_KEY,

            self.timestamp,

            self.raw_body

        )

        self.headers = {

            "HTTP_X_WEBHOOK_TIMESTAMP": self.timestamp,

            "HTTP_X_WEBHOOK_SIGNATURE": self.signature,

        }

        self.booking = Bookings.objects.create(

            guest=self.user,

            listing=self.listing,

            start_date="2025-12-30",

            end_date="2025-12-31",

            total_price=100,

            status=Bookings.STATUS_PENDING,
            hold_expires_at=timezone.now() + timedelta(minutes=10),

        )

        self.payment =  Payment.objects.create(

            booking=self.booking,

            order_id="order_123456789",

            amount=Decimal("1000.00"),

            status=Payment.INITIATED,

        )

    def test_missing_headers_returns_400(self):

        response = self.client.post(self.url, self.payload, content_type="application/json")

        self.assertEqual(response.status_code, 400)

    def test_invalid_signature_returns_400(self):

        headers = {

            "HTTP_X_WEBHOOK_TIMESTAMP": self.timestamp,

            "HTTP_X_WEBHOOK_SIGNATURE": "invalid-signature",

        }

        response = self.client.post(self.url, data=self.payload, content_type="application/json", **headers)

        self.assertEqual(response.status_code, 400)

    def test_payment_success_updates_booking(self):

        response = self.client.post(self.url, data=self.payload, content_type="application/json", **self.headers)

        self.assertEqual(response.status_code, 200)

        self.payment.refresh_from_db()

        self.booking.refresh_from_db()

        self.assertEqual(self.payment.status, Payment.PAID)

        self.assertEqual(self.booking.status, Bookings.STATUS_CONFIRMED)

    def test_idempotent_webhook(self):

        self.payment.status = Payment.PAID

        self.payment.save()

        response = self.client.post(self.url, data=self.payload, content_type="application/json", **self.headers)

        self.assertEqual(response.status_code, 200)

        self.assertEqual(response.data["status"], "already processed")

    def test_payment_success_with_expired_hold(self):
        from django.utils import timezone
        from datetime import timedelta
        self.booking.hold_expires_at = timezone.now() - timedelta(minutes=5)
        self.booking.save()
        response = self.client.post(self.url, data=self.payload, content_type="application/json", **self.headers)
        self.assertEqual(response.status_code, 409)
        self.payment.refresh_from_db()
        self.booking.refresh_from_db()
        self.assertEqual(self.payment.status, Payment.FAILED)
        self.assertEqual(self.booking.status, Bookings.STATUS_CANCELLED)

from unittest.mock import patch
from rest_framework.test import APIClient

class VerifyCashfreePaymentTest(TestCase):
    def setUp(self):
        from django.utils import timezone
        from datetime import timedelta
        self.client = APIClient()
        self.guest = User.objects.create_user(email="g@test.com", password="pwd", username="g")
        self.host = User.objects.create_user(email="h@test.com", password="pwd", username="h", is_host=True)
        self.client.force_authenticate(user=self.guest)
        self.listing = Listings.objects.create(
            host=self.host, title="T", title_slug="t", description="D", price_per_night=100, max_guests=4,
            country="USA", city="Seattle", address="123", property_type="apartment", bedrooms="1", beds="1", bathrooms=1
        )
        self.booking = Bookings.objects.create(
            guest=self.guest, listing=self.listing, start_date="2026-10-01", end_date="2026-10-05", status=Bookings.STATUS_PENDING,
            hold_expires_at=timezone.now() + timedelta(minutes=10), total_price=1000
        )
        self.payment = Payment.objects.create(
            booking=self.booking, order_id="order_123", payment_session_id="session_123", amount=1000, status=Payment.INITIATED
        )
        self.url = reverse("bookings:payment-verify")

    @patch("bookings.views.Cashfree.PGFetchOrder")
    def test_verify_payment_success(self, mock_fetch):
        mock_response = type("obj", (object,), {"data": type("obj2", (object,), {"order_status": "PAID"})})
        mock_fetch.return_value = mock_response

        response = self.client.post(self.url, {"booking_id": self.booking.id}, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["status"], "paid")
        self.booking.refresh_from_db()
        self.assertEqual(self.booking.status, Bookings.STATUS_CONFIRMED)

    @patch("bookings.views.Cashfree.PGFetchOrder")
    def test_verify_payment_expired_hold(self, mock_fetch):
        from django.utils import timezone
        from datetime import timedelta
        self.booking.hold_expires_at = timezone.now() - timedelta(minutes=5)
        self.booking.save()
        mock_response = type("obj", (object,), {"data": type("obj2", (object,), {"order_status": "PAID"})})
        mock_fetch.return_value = mock_response

        response = self.client.post(self.url, {"booking_id": self.booking.id}, format="json")
        self.assertEqual(response.status_code, 409)
        self.assertIn("expired", response.data["error"])
        self.booking.refresh_from_db()
        self.payment.refresh_from_db()
        self.assertEqual(self.booking.status, Bookings.STATUS_CANCELLED)
        self.assertEqual(self.payment.status, Payment.FAILED)
