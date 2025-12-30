from django.db import models
from django.conf import settings
from listings.models import Listings
from django.core.exceptions import ValidationError
from django.db.models import Q
from users.base_models import TimeStampedModel
from datetime import date


class Bookings(TimeStampedModel):


    STATUS_PENDING = "pending"
    STATUS_CONFIRMED = "confirmed"
    STATUS_CANCELLED = "cancelled"
    STATUS_PAID = "paid"
    STATUS_FAILED = "failed"
    STATUS_REFUNDED = "refunded"
    STATUS_ONGOING = "ongoing"

    guest = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="bookings"
    )

    listing = models.ForeignKey(
        Listings,
        on_delete=models.CASCADE,
        related_name="bookings"
    )

    start_date = models.DateField()
    end_date = models.DateField()

    total_price = models.DecimalField(max_digits=10, decimal_places=2)

    STATUS_CHOICES = [
        (STATUS_PENDING, "Pending"),
        (STATUS_CONFIRMED, "Confirmed"),
        (STATUS_CANCELLED, "Cancelled"),
        (STATUS_PAID, "Paid"),
        (STATUS_FAILED, "Failed"),
        (STATUS_REFUNDED, "Refunded"),
        (STATUS_ONGOING, "Ongoing"),
    ]

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default=STATUS_PENDING
    )


    def __str__(self):
        return f"{self.guest} : {self.listing}"

    def clean(self):
        if self.start_date > self.end_date:
            raise ValidationError("Start date must be before end date")
        if self.total_price < 0:
            raise ValidationError("Total price must be positive")
        if self.guest == self.listing.host:
            raise ValidationError("Guest cannot be the host")

    @property
    def can_review(self):
        return(
            self.status == self.STATUS_CONFIRMED and
            date.today() > self.end_date and
            not hasattr(self, "review")
        )

    class Meta:
        verbose_name = "Booking"
        verbose_name_plural = "Bookings"
        constraints = [
            models.CheckConstraint(
                check = Q(start_date__lte = models.F("end_date")) & Q(end_date__gte = models.F("start_date")),
                name = "start_date_before_end_date"
            ),

            models.CheckConstraint(
                check = Q(total_price__gte = 0),
                name = "total_price_must_be_positive"
            ),

            # Only prevent duplicate CONFIRMED bookings
            # This allows retrying failed bookings for same dates
            models.UniqueConstraint(
                fields = ["guest", "listing", "start_date", "end_date"],
                condition = Q(status__in=["confirmed", "paid"]),
                name = "unique_confirmed_booking"
            )
        ]


    
    

class Payment(models.Model):
    INITIATED = "initiated"
    PAID = "paid"
    FAILED = "failed"
    REFUNDED = "refunded"

    STATUS_CHOICES = [
        (INITIATED, "Initiated"),
        (PAID, "Paid"),
        (FAILED, "Failed"),
        (REFUNDED, "Refunded"),
    ]

    booking = models.ForeignKey(
        Bookings,
        on_delete=models.CASCADE,
        related_name="payments"
    )

    amount = models.DecimalField(max_digits=10, decimal_places=2)
    gateway = models.CharField(max_length=50, default="cashfree")
    order_id = models.CharField(max_length=255, unique=True)
    payment_session_id = models.CharField(max_length=255, blank=True, null=True)
    transaction_id = models.CharField(max_length=255, blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.booking.guest.username} : {self.booking.listing.title} for {self.booking.start_date} to {self.booking.end_date}"
