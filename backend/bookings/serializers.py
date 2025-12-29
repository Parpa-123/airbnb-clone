from rest_framework import serializers
from .models import Bookings, Payment
from listings.models import Listings
from users.models import User
from django.utils import timezone
from listings.serializers import ListingSerializer
from users.serializers import UserProfileSerializer

# Create your tests here.

class BookingSerializer(serializers.ModelSerializer):

    start_date = serializers.DateField()
    end_date = serializers.DateField()
    
    # Accept listing ID for creation, but return full object when reading
    listing = serializers.PrimaryKeyRelatedField(queryset=Listings.objects.all())

    class Meta:
        model = Bookings
        fields = [
            "id",
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
            raise serializers.ValidationError("Start date cannot be in the past")

        if end_date < start_date:
            raise serializers.ValidationError("End date must be after start date")

        if start_date > end_date:
            raise serializers.ValidationError("Start date must be before end date")

        if Bookings.objects.filter(listing=listing,start_date__lte = end_date, end_date__gte = start_date, status=Bookings.STATUS_CONFIRMED).exists():
            raise serializers.ValidationError("Listing is already booked for this period")
        
        
        request = self.context.get('request')
        if request and hasattr(request, 'user') and request.user == listing.host:
            raise serializers.ValidationError("You cannot book your own listing")
        
        return attrs

    def create(self, validated_data):
        listing = validated_data.get("listing")
        start_date = validated_data.get("start_date")
        end_date = validated_data.get("end_date")
        
        # listing is already a Listings object from PrimaryKeyRelatedField
        total_price = listing.price_per_night * (end_date - start_date).days
        validated_data["total_price"] = total_price
        validated_data['status'] = Bookings.STATUS_PENDING
        
        return super().create(validated_data)
    
    def to_representation(self, instance):
        """Return nested listing data when reading"""
        representation = super().to_representation(instance)
        representation['listing'] = ListingSerializer(instance.listing).data
        return representation

class ViewBookingSerializer(serializers.ModelSerializer):
    guest = UserProfileSerializer(read_only=True)
    listing = ListingSerializer(read_only=True)
    can_review = serializers.BooleanField(read_only=True)

    class Meta:
        model = Bookings
        fields = [
            "id",
            "guest",
            "listing",

            "start_date",
            "end_date",
            "total_price",
            "status",
            "can_review"
        ]

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = "__all__"
        read_only_fields = ["status", "transaction_id"]


class BookingDetailSerializer(serializers.ModelSerializer):
    """
    Serializer for detailed booking view with full nested listing data.
    Used for GET requests to retrieve complete booking information.
    """
    guest = UserProfileSerializer(read_only=True)
    listing = ListingSerializer(read_only=True)
    can_review = serializers.BooleanField(read_only=True)

    class Meta:
        model = Bookings
        fields = [
            "id",
            "guest",
            "listing",
            "start_date",
            "end_date",
            "total_price",
            "status",
            "created_at",
            "updated_at",
            "can_review",
        ]
        read_only_fields = fields  # All fields are read-only for detail view