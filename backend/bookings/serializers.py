from rest_framework import serializers
from .models import Bookings
from listings.models import Listings
from users.models import User
from django.utils import timezone

# Create your tests here.

class CreateBookingSerializer(serializers.ModelSerializer):

    start_date = serializers.DateField()
    end_date = serializers.DateField()
    guest = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    listing = serializers.PrimaryKeyRelatedField(queryset=Listings.objects.all())

    class Meta:
        model = Bookings
        fields = [
            "guest",
            "listing",
            "start_date",
            "end_date",
            "total_price",
            "status",
        ]

    def validate(self, attrs):
        start_date , end_date = attrs.get("start_date"), attrs.get("end_date")

        now = timezone.localtime(timezone.now()).date()

        if start_date < now:
            raise serializers.ValidationError("Start date must be after today")

        if end_date < start_date:
            raise serializers.ValidationError("End date must be after start date")

        if start_date > end_date:
            raise serializers.ValidationError("Start date must be before end date")

        if Bookings.objects.filter(start_date__lte = end_date, end_date__gte = start_date).exists():
            raise serializers.ValidationError("Listing is already booked for this period")
        

        return attrs

class PublicBookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bookings
        fields = [
            "guest",
            "listing",
            "start_date",
            "end_date",
            "total_price",
            "status",
        ]