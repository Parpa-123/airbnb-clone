from rest_framework import serializers
from .models import Bookings
from listings.models import Listings
from users.models import User
from django.utils import timezone
from listings.serializers import ListingSerializer
from users.serializers import UserProfileSerializer

# Create your tests here.

class BookingSerializer(serializers.ModelSerializer):

    start_date = serializers.DateField()
    end_date = serializers.DateField()
    
    listing = serializers.PrimaryKeyRelatedField(queryset=Listings.objects.all())

    class Meta:
        model = Bookings
        fields = [
            
            "listing",
            "start_date",
            "end_date",
            
            
        ]
        read_only_fields = [
            "status",
            "total_price",
        ]

    def validate(self, attrs):
        start_date , end_date = attrs.get("start_date"), attrs.get("end_date")
        listing = attrs.get("listing")

        now = timezone.localtime(timezone.now()).date()

        if start_date < now:
            raise serializers.ValidationError("Start date must be after today")

        if end_date < start_date:
            raise serializers.ValidationError("End date must be after start date")

        if start_date > end_date:
            raise serializers.ValidationError("Start date must be before end date")

        if Bookings.objects.filter(listing=listing,start_date__lte = end_date, end_date__gte = start_date).exists():
            raise serializers.ValidationError("Listing is already booked for this period")
        
        return attrs

    def create(self, validated_data):
        listing = validated_data.get("listing")
        start_date = validated_data.get("start_date")
        end_date = validated_data.get("end_date")
        
        # listing is already a Listings object from PrimaryKeyRelatedField
        total_price = listing.price_per_night * (end_date - start_date).days
        validated_data["total_price"] = total_price
        
        return super().create(validated_data)

class ViewBookingSerializer(serializers.ModelSerializer):
    guest = UserProfileSerializer(read_only=True)
    listing = ListingSerializer(read_only=True)

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