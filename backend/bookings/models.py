from django.db import models
from django.conf import settings
from listings.models import Listings
from django.core.exceptions import ValidationError
from django.db.models import Q


class Bookings(models.Model):

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
        ("confirmed", "Confirmed"),
        ("cancelled", "Cancelled"),
        ("pending", "Pending"),
    ]

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="confirmed"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Booking by {self.guest} for {self.listing}"

    def clean(self):
        if self.start_date > self.end_date:
            raise ValidationError("Start date must be before end date")
        if self.total_price < 0:
            raise ValidationError("Total price must be positive")
        if self.guest == self.listing.host:
            raise ValidationError("Guest cannot be the host")

    class Meta:
        verbose_name = "Booking"
        verbose_name_plural = "Bookings"
        constraints = [
            models.CheckConstraint(
                check = Q(start_date__lte = end_date) & Q(end_date__gte = start_date),
                name = "start_date_before_end_date"
            ),

            models.CheckConstraint(
                check = Q(total_price__gte = 0),
                name = "total_price_must_be_positive"
            ),

            models.UniqueConstraint(
                fields = ["guest", "listing", "start_date", "end_date"],
                name = "unique_booking"
            )
        ]

