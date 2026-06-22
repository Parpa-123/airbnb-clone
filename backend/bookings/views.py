import uuid

import hmac

import hashlib

import base64

import logging

import json
from datetime import timedelta

from django.db import transaction

from django.conf import settings
from django.utils import timezone

from django.views.decorators.csrf import csrf_exempt

from django.utils.decorators import method_decorator

from rest_framework import generics, status

from rest_framework.views import APIView
from rest_framework.throttling import ScopedRateThrottle

from rest_framework.response import Response

from drf_spectacular.utils import extend_schema

from cashfree_pg.api_client import Cashfree

from cashfree_pg.models.create_order_request import CreateOrderRequest

from users.base_views import AuthAPIView
from conf.pagination import BookingsPagination
from listings.models import Listings

from .models import Bookings, Payment

from .serializers import BookingSerializer, ViewBookingSerializer, BookingDetailSerializer, BookingOrderCreateSerializer

logger = logging.getLogger(__name__)

def trigger_refund(payment, booking):
    """
    Utility function to handle automatic refunds.
    Triggered when a payment is captured but the booking hold has expired.
    TODO: Integrate with Cashfree Refund API.
    """
    logger.critical(
        f"CRITICAL: Payment {payment.id} for Order {payment.order_id} was paid, "
        f"but booking {booking.id} hold expired! A manual refund is required."
    )

class BookingDetailView(AuthAPIView, generics.RetrieveAPIView):

    serializer_class = BookingSerializer
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "booking_detail"

    def get_queryset(self):

        return (
            Bookings.objects
            .select_related("guest", "listing", "listing__host")
            .prefetch_related("listing__listingimages")
            .filter(guest=self.request.user)
        )

class BookingCreateView(AuthAPIView, generics.CreateAPIView):

    serializer_class = BookingSerializer
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "booking_create"

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        listing = serializer.validated_data["listing"]
        start_date = serializer.validated_data["start_date"]
        end_date = serializer.validated_data["end_date"]

        with transaction.atomic():
            Listings.objects.select_for_update().get(id=listing.id)
            if Bookings.conflicting_reservations(
                listing=listing,
                start_date=start_date,
                end_date=end_date,
                at_time=timezone.now(),
            ).exists():
                return Response(
                    {"error": "Listing is temporarily unavailable for this period"},
                    status=status.HTTP_409_CONFLICT,
                )

            booking = serializer.save(
                guest=request.user,
                status=Bookings.STATUS_PENDING,
            )

        output = self.get_serializer(booking)
        headers = self.get_success_headers(output.data)
        return Response(output.data, status=status.HTTP_201_CREATED, headers=headers)

class BookingListView(AuthAPIView, generics.ListAPIView):

    serializer_class = ViewBookingSerializer
    pagination_class = BookingsPagination
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "booking_list"

    def get_queryset(self):

        if getattr(self, "swagger_fake_view", False) or self.request.user.is_anonymous:

             return Bookings.objects.none()

        return Bookings.objects.filter(
            guest=self.request.user,
            status__in=[Bookings.STATUS_CONFIRMED],
        ).select_related(
            "guest",
            "listing",
            "listing__host",
        ).prefetch_related("listing__listingimages")

class BookingDestroyView(AuthAPIView, generics.DestroyAPIView):

    serializer_class = BookingSerializer
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "booking_destroy"

    def get_queryset(self):

        return Bookings.objects.filter(guest=self.request.user)

    def perform_destroy(self, instance):

        instance.status = Bookings.STATUS_CANCELLED

        instance.save(update_fields=["status"])

class BookingDetailRetrieveView(AuthAPIView, generics.RetrieveAPIView):

    serializer_class = BookingDetailSerializer
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "booking_detail_retrieve"

    def get_queryset(self):

        return (
            Bookings.objects
            .select_related("listing", "listing__host", "guest")
            .prefetch_related("listing__listingimages")
            .filter(guest=self.request.user)
        )

class CreateCashfreeOrderView(AuthAPIView, generics.GenericAPIView):

    serializer_class = BookingOrderCreateSerializer
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "booking_payment_create_order"

    @extend_schema(request=BookingOrderCreateSerializer, responses=None)

    def post(self, request):

        booking_id = request.data.get("booking_id")
        now = timezone.now()
        hold_extension = now + timedelta(
            minutes=settings.BOOKING_PAYMENT_HOLD_EXTENSION_MINUTES
        )

        try:
            with transaction.atomic():
                booking = (
                    Bookings.objects
                    .select_for_update()
                    .select_related("guest", "listing")
                    .get(
                        id=booking_id,
                        guest=request.user,
                        status=Bookings.STATUS_PENDING,
                    )
                )

                if not booking.is_hold_active(at_time=now):
                    booking.status = Bookings.STATUS_CANCELLED
                    booking.save(update_fields=["status"])
                    return Response(
                        {"error": "Booking hold has expired. Please try again."},
                        status=status.HTTP_409_CONFLICT,
                    )

                existing_payment = (
                    booking.payments
                    .filter(status=Payment.INITIATED)
                    .order_by("-created_at")
                    .first()
                )
                if existing_payment and existing_payment.payment_session_id:
                    return Response(
                        {
                            "order_id": existing_payment.order_id,
                            "payment_session_id": existing_payment.payment_session_id,
                        },
                        status=status.HTTP_200_OK,
                    )

                booking.hold_expires_at = max(
                    booking.hold_expires_at or hold_extension,
                    hold_extension,
                )
                booking.save(update_fields=["hold_expires_at"])
        except Bookings.DoesNotExist:
            return Response(
                {"error": "Pending booking not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        Cashfree.XClientId = settings.CASHFREE_APP_ID

        Cashfree.XClientSecret = settings.CASHFREE_SECRET_KEY

        Cashfree.XEnvironment = (

            Cashfree.SANDBOX

            if settings.CASHFREE_ENV == "TEST"

            else Cashfree.PRODUCTION

        )

        order_id = f"booking_{booking.id}_{uuid.uuid4().hex[:8]}"

        USD_TO_INR = 90

        amount_in_inr = float(booking.total_price) * USD_TO_INR

        order_request = CreateOrderRequest(

            order_id=order_id,

            order_amount=amount_in_inr,

            order_currency="INR",

            customer_details={

                "customer_id": f"user_{request.user.id}",

                "customer_email": request.user.email,

                "customer_phone": str(request.user.phone.national_number),

            },

            order_meta={

                "return_url": f"{settings.FRONTEND_URL}/bookings/overview"

            },

        )

        try:

            cashfree_client = Cashfree()

            response = cashfree_client.PGCreateOrder("2025-01-01", order_request)

            with transaction.atomic():

                payment = Payment.objects.create(

                    booking=booking,

                    order_id=order_id,

                    payment_session_id=response.data.payment_session_id,

                    amount=amount_in_inr,

                    status=Payment.INITIATED,

                )

            return Response({

                "order_id": order_id,

                "payment_session_id": payment.payment_session_id,

            })

        except Exception:

            logger.exception("Cashfree order creation failed")

            return Response({"error": "Unable to create payment order"}, status=500)

@method_decorator(csrf_exempt, name="dispatch")

class CashfreeWebhookView(APIView):

    authentication_classes = []

    permission_classes = []
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "webhook_cashfree"

    @extend_schema(request=None, responses=None)

    def post(self, request):

        timestamp = request.headers.get("x-webhook-timestamp")

        signature = request.headers.get("x-webhook-signature")

        if not timestamp or not signature:

            return Response({"error": "Missing headers"}, status=400)

        raw_body = request.body.decode("utf-8")

        signed_payload = timestamp + raw_body

        expected_signature = base64.b64encode(

            hmac.new(

                settings.CASHFREE_SECRET_KEY.encode(),

                signed_payload.encode(),

                hashlib.sha256,

            ).digest()

        ).decode()

        if not hmac.compare_digest(signature, expected_signature):

            logger.error("Cashfree webhook signature mismatch")

            return Response({"error": "Invalid signature"}, status=400)

        try:

            payload = json.loads(raw_body)

            event_type = payload.get("type")

            order_id = payload["data"]["order"]["order_id"]

        except Exception:

            logger.error("Invalid Cashfree webhook payload")

            return Response({"error": "Invalid payload"}, status=400)

        try:

            with transaction.atomic():

                payment = (

                    Payment.objects

                    .select_for_update()

                    .select_related("booking")

                    .get(order_id=order_id)

                )

                if payment.status == Payment.PAID:

                    return Response({"status": "already processed"}, status=200)

                booking = payment.booking
                if booking.status != Bookings.STATUS_PENDING:
                    return Response({"status": "ignored"}, status=200)

                if event_type.startswith("PAYMENT_SUCCESS"):
                    if not booking.is_hold_active():
                        payment.status = Payment.FAILED
                        booking.status = Bookings.STATUS_CANCELLED
                        payment.save(update_fields=["status"])
                        booking.save(update_fields=["status"])
                        trigger_refund(payment, booking)
                        return Response(
                            {"error": "Booking hold expired before payment confirmation"},
                            status=status.HTTP_409_CONFLICT,
                        )

                    payment.status = Payment.PAID

                    payment.transaction_id = payload["data"]["payment"].get("cf_payment_id")

                    booking.status = Bookings.STATUS_CONFIRMED
                    booking.hold_expires_at = None

                elif event_type.startswith("PAYMENT_FAILED"):

                    payment.status = Payment.FAILED

                    booking.status = Bookings.STATUS_FAILED
                    booking.hold_expires_at = None

                else:

                    logger.warning(f"Unhandled Cashfree event: {event_type}")

                    return Response({"status": "ignored"}, status=200)

                payment.save(update_fields=["status", "transaction_id"])

                booking.save(update_fields=["status", "hold_expires_at"])

            return Response({"status": "ok"}, status=200)

        except Payment.DoesNotExist:

            logger.error(f"Payment not found for order_id={order_id}")

            return Response({"error": "Order not found"}, status=404)

        except Exception:

            logger.exception("Cashfree webhook processing failed")

            return Response({"error": "Webhook error"}, status=500)

class VerifyCashfreePaymentView(AuthAPIView, generics.GenericAPIView):
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "booking_payment_verify"

    def post(self, request):
        booking_id = request.data.get("booking_id")
        if not booking_id:
            return Response({"error": "Missing booking_id"}, status=status.HTTP_400_BAD_REQUEST)

        Cashfree.XClientId = settings.CASHFREE_APP_ID
        Cashfree.XClientSecret = settings.CASHFREE_SECRET_KEY
        Cashfree.XEnvironment = (
            Cashfree.SANDBOX
            if settings.CASHFREE_ENV == "TEST"
            else Cashfree.PRODUCTION
        )

        try:
            with transaction.atomic():
                booking = (
                    Bookings.objects
                    .select_for_update()
                    .get(id=booking_id, guest=request.user)
                )

                payment = (
                    Payment.objects
                    .select_for_update()
                    .filter(booking=booking)
                    .order_by("-created_at")
                    .first()
                )

                if not payment or not payment.order_id:
                    return Response({"error": "Payment not found"}, status=status.HTTP_404_NOT_FOUND)

                if payment.status == Payment.PAID:
                    return Response({"status": "paid"}, status=status.HTTP_200_OK)

                if payment.status == Payment.FAILED:
                    return Response({"status": "failed"}, status=status.HTTP_200_OK)

                try:
                    cashfree_client = Cashfree()
                    response = cashfree_client.PGFetchOrder("2025-01-01", payment.order_id)
                    order_status = getattr(response.data, "order_status", None)
                except Exception as e:
                    logger.error(f"Error fetching Cashfree order {payment.order_id}: {e}")
                    return Response({"status": "pending", "error": "Unable to verify with Cashfree"}, status=status.HTTP_200_OK)

                if order_status == "PAID":
                    if not booking.is_hold_active():
                        payment.status = Payment.FAILED
                        booking.status = Bookings.STATUS_CANCELLED
                        payment.save(update_fields=["status"])
                        booking.save(update_fields=["status"])
                        trigger_refund(payment, booking)
                        return Response(
                            {"error": "Booking hold expired before payment was verified. A refund has been initiated."},
                            status=status.HTTP_409_CONFLICT,
                        )

                    payment.status = Payment.PAID
                    booking.status = Bookings.STATUS_CONFIRMED
                    booking.hold_expires_at = None
                    payment.save(update_fields=["status"])
                    booking.save(update_fields=["status", "hold_expires_at"])
                    return Response({"status": "paid"}, status=status.HTTP_200_OK)
                elif order_status in ["ACTIVE", "PENDING"]:
                    return Response({"status": "pending"}, status=status.HTTP_200_OK)
                else:
                    payment.status = Payment.FAILED
                    booking.status = Bookings.STATUS_FAILED
                    booking.hold_expires_at = None
                    payment.save(update_fields=["status"])
                    booking.save(update_fields=["status", "hold_expires_at"])
                    return Response({"status": "failed"}, status=status.HTTP_200_OK)

        except Bookings.DoesNotExist:
            return Response({"error": "Booking not found"}, status=status.HTTP_404_NOT_FOUND)
