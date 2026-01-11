import uuid
import hmac
import hashlib
import base64
import logging

from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response

from cashfree_pg.api_client import Cashfree
from cashfree_pg.models.create_order_request import CreateOrderRequest

from users.base_views import AuthAPIView
from .models import Bookings, Payment
from .serializers import BookingSerializer, ViewBookingSerializer, BookingDetailSerializer

logger = logging.getLogger(__name__)


# =========================
# Booking Views
# =========================

class BookingDetailView(AuthAPIView, generics.RetrieveAPIView):
    serializer_class = BookingSerializer

    def get_queryset(self):
        return Bookings.objects.filter(guest=self.request.user)


class BookingCreateView(AuthAPIView, generics.CreateAPIView):
    serializer_class = BookingSerializer

    def perform_create(self, serializer):
        serializer.save(
            guest=self.request.user,
            status=Bookings.STATUS_PENDING
        )


class BookingListView(AuthAPIView, generics.ListAPIView):
    serializer_class = ViewBookingSerializer

    def get_queryset(self):
        return Bookings.objects.filter(
            guest=self.request.user,
            status__in=[
                Bookings.STATUS_CONFIRMED,
            ]
        )


class BookingDestroyView(AuthAPIView, generics.DestroyAPIView):
    serializer_class = BookingSerializer

    def get_queryset(self):
        return Bookings.objects.filter(guest=self.request.user)

    def perform_destroy(self, instance):
        instance.status = Bookings.STATUS_CANCELLED
        instance.save(update_fields=["status"])


class BookingDetailRetrieveView(AuthAPIView, generics.RetrieveAPIView):
    """
    Retrieve detailed booking information including full nested listing data.
    Endpoint: /bookings/detail/{id}/
    """
    serializer_class = BookingDetailSerializer

    def get_queryset(self):
        return Bookings.objects.select_related('listing', 'guest').filter(guest=self.request.user)


# =========================
# Cashfree Order Creation
# =========================

class CreateCashfreeOrderView(AuthAPIView, APIView):

    def post(self, request):
        booking_id = request.data.get("booking_id")

        booking = Bookings.objects.get(
            id=booking_id,
            guest=request.user,
            status=Bookings.STATUS_PENDING
        )

        # Cashfree configuration
        Cashfree.XClientId = settings.CASHFREE_APP_ID
        Cashfree.XClientSecret = settings.CASHFREE_SECRET_KEY
        Cashfree.XEnvironment = (
            Cashfree.SANDBOX
            if settings.CASHFREE_ENV == "TEST"
            else Cashfree.PRODUCTION
        )

        order_id = f"booking_{booking.id}_{uuid.uuid4().hex[:8]}"

        # Convert USD → INR (temporary, dev-only)
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

        except Exception as e:
            logger.exception("Cashfree order creation failed")
            return Response({"error": str(e)}, status=500)




@method_decorator(csrf_exempt, name='dispatch')
class CashfreeWebhookView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        """
        Cashfree Webhook Handler
        - Base64 HMAC verification including timestamp
        - Idempotent
        - Booking confirmation only here
        """

        # 1. Extract timestamp & signature
        timestamp = (
            request.headers.get("x-webhook-timestamp")
            or request.headers.get("X-Webhook-Timestamp")
        )
        signature = (
            request.headers.get("x-webhook-signature")
            or request.headers.get("X-Webhook-Signature")
        )

        if not timestamp or not signature:
            logger.error("Webhook missing signature or timestamp header")
            return Response({"error": "Missing headers"}, status=400)

        # 2. Compute expected signature
        signed_payload = timestamp + request.body.decode("utf-8")
        computed_hmac = hmac.new(
            settings.CASHFREE_SECRET_KEY.encode(),
            signed_payload.encode(),
            hashlib.sha256
        ).digest()
        expected_signature = base64.b64encode(computed_hmac).decode()

        if not hmac.compare_digest(signature, expected_signature):
            logger.error("Signature mismatch")
            return Response({"error": "Invalid signature"}, status=400)

        # 3. Parse payload
        payload = request.data
        event_type = payload.get("type")

        try:
            order_id = payload["data"]["order"]["order_id"]
        except KeyError:
            logger.error("Invalid payload structure")
            return Response({"error": "Invalid payload"}, status=400)

        try:
            payment = Payment.objects.select_related("booking").get(
                order_id=order_id
            )
        except Payment.DoesNotExist:
            return Response({"error": "Payment not found"}, status=404)

        booking = payment.booking

        # 4. Idempotency
        if payment.status == Payment.PAID:
            return Response({"status": "already processed"}, status=200)

        # 5. Handle events
        if event_type in ("PAYMENT_SUCCESS", "PAYMENT_SUCCESS_WEBHOOK"):
            payment.status = Payment.PAID
            payment.transaction_id = payload["data"]["payment"].get("cf_payment_id")
            payment.save(update_fields=["status", "transaction_id"])

            booking.status = Bookings.STATUS_CONFIRMED
            booking.save(update_fields=["status"])
            logger.info(f"Payment confirmed: {order_id}")

        elif event_type in (
            "PAYMENT_FAILED",
            "PAYMENT_FAILED_WEBHOOK",
            "PAYMENT_USER_DROPPED",
            "PAYMENT_USER_DROPPED_WEBHOOK",
        ):
            payment.status = Payment.FAILED
            payment.save(update_fields=["status"])

            booking.status = (
                Bookings.STATUS_CANCELLED
                if "USER_DROPPED" in event_type
                else Bookings.STATUS_FAILED
            )
            booking.save(update_fields=["status"])
            logger.info(f"Payment failed/dropped: {order_id}")

        else:
            logger.warning(f"Unhandled webhook event: {event_type}")
            return Response({"status": "ignored"}, status=200)

        return Response({"status": "ok"}, status=200)


class VerifyPaymentView(AuthAPIView, APIView):
    """
    Manually verify payment status by fetching from Cashfree API.
    Used as fallback when webhook delivery fails.
    """
    def post(self, request):
        booking_id = request.data.get("booking_id")
        
        if not booking_id:
            return Response({"error": "booking_id is required"}, status=400)
        
        try:
            # Get the booking and associated payment
            booking = Bookings.objects.get(
                id=booking_id,
                guest=request.user
            )
            
            payment = Payment.objects.filter(booking=booking).first()
            
            if not payment:
                return Response({"error": "Payment not found"}, status=404)
            
            # If already paid, return success
            if payment.status == Payment.PAID:
                return Response({
                    "status": "paid",
                    "booking_status": booking.status
                })
            
            # Configure Cashfree
            Cashfree.XClientId = settings.CASHFREE_APP_ID
            Cashfree.XClientSecret = settings.CASHFREE_SECRET_KEY
            Cashfree.XEnvironment = (
                Cashfree.SANDBOX
                if settings.CASHFREE_ENV == "TEST"
                else Cashfree.PRODUCTION
            )
            
            # Fetch order details from Cashfree
            cashfree_client = Cashfree()
            order_response = cashfree_client.PGFetchOrder(
                "2025-01-01",
                payment.order_id
            )
            
            if not order_response or not order_response.data:
                return Response({"error": "Failed to fetch order from Cashfree"}, status=500)
            
            order_status = order_response.data.order_status
            
            # Update payment and booking based on Cashfree status
            if order_status in ("PAID", "ACTIVE"):
                payment.status = Payment.PAID
                payment.save(update_fields=["status"])
                
                booking.status = Bookings.STATUS_CONFIRMED
                booking.save(update_fields=["status"])
                logger.info(f"Payment manually verified and confirmed: {payment.order_id}")
                
                return Response({
                    "status": "paid",
                    "booking_status": booking.status
                })
            
            elif order_status in ("EXPIRED", "TERMINATED"):
                payment.status = Payment.FAILED
                payment.save(update_fields=["status"])
                
                booking.status = Bookings.STATUS_FAILED
                booking.save(update_fields=["status"])
                
                return Response({
                    "status": "failed",
                    "booking_status": booking.status
                })
            
            else:
                # Still pending or processing
                return Response({
                    "status": "pending",
                    "booking_status": booking.status,
                    "order_status": order_status
                })
                
        except Bookings.DoesNotExist:
            return Response({"error": "Booking not found"}, status=404)
        except Exception as e:
            logger.exception("Payment verification failed")
            return Response({"error": str(e)}, status=500)
