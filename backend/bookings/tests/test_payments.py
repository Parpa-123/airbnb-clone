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
            address='123 Sample Street',
            country='USA',
            city='New York',
            property_type='apartment',
            max_guests=4,
            bhk_choice=2,
            bed_choice=3,
            bathrooms=2.0,
            price_per_night=Decimal('100.00'),
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