from rest_framework import serializers
from .models import Bookings, Payment
from listings.models import Listings
from users.models import User
from django.utils import timezone
from listings.serializers import ListingSerializer
from users.serializers import UserProfileSerializer

# Create your tests here.

class BookingOrderCreateSerializer(serializers.Serializer):
    booking_id = serializers.UUIDField()

class BookingSerializer(serializers.ModelSerializer):

    start_date = serializers.DateField()
    end_date = serializers.DateField()
    
    # Accept listing ID for creation, but return full object when reading
    listing = serializers.PrimaryKeyRelatedField(queryset=Listings.objects.all())
    
    # Guest breakdown
    adults = serializers.IntegerField(min_value=1, max_value=16, default=1)
    children = serializers.IntegerField(min_value=0, max_value=15, default=0)
    infants = serializers.IntegerField(min_value=0, max_value=5, default=0)
    pets = serializers.IntegerField(min_value=0, max_value=5, default=0)

    class Meta:
        model = Bookings
        fields = [
            "id",
            "listing",
            "start_date",
            "end_date",
            "adults",
            "children",
            "infants",
            "pets",
        ]
        read_only_fields = [
            "status",
            "total_price",
        ]

    def validate(self, attrs):
        start_date, end_date = attrs.get("start_date"), attrs.get("end_date")
        listing = attrs.get("listing")
        adults = attrs.get("adults", 1)
        children = attrs.get("children", 0)
        pets = attrs.get("pets", 0)

        now = timezone.localtime(timezone.now()).date()

        if start_date < now:
            raise serializers.ValidationError("Start date cannot be in the past")

        if end_date < start_date:
            raise serializers.ValidationError("End date must be after start date")

        if start_date > end_date:
            raise serializers.ValidationError("Start date must be before end date")

        if Bookings.objects.filter(listing=listing, start_date__lte=end_date, end_date__gte=start_date, status=Bookings.STATUS_CONFIRMED).exists():
            raise serializers.ValidationError("Listing is already booked for this period")
        
        # Validate adults against listing capacity
        if adults > listing.max_guests:
            raise serializers.ValidationError(f"This listing allows a maximum of {listing.max_guests} adults")
        
        # Validate children policy
        if children > 0 and not listing.allows_children:
            raise serializers.ValidationError("This listing does not allow children")
        
        # Validate pets policy
        if pets > 0 and not listing.allows_pets:
            raise serializers.ValidationError("This listing does not allow pets")
        
        request = self.context.get('request')
        if request and hasattr(request, 'user') and request.user == listing.host:
            raise serializers.ValidationError("You cannot book your own listing")

        if request and not request.user.phone:
            raise serializers.ValidationError("Must have a phone number to book a listing.")
        
        return attrs

    def create(self, validated_data):
        listing = validated_data.get("listing")
        start_date = validated_data.get("start_date")
        end_date = validated_data.get("end_date")
        pets = validated_data.get("pets", 0)
        
        # Calculate total price
        nights = (end_date - start_date).days
        validated_data["total_price"] = listing.price_per_night * nights
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
            "adults",
            "children",
            "infants",
            "pets",
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
            "adults",
            "children",
            "infants",
            "pets",
            "total_price",
            "status",
            "created_at",
            "updated_at",
            "can_review",
        ]
        read_only_fields = fields  # All fields are read-only for detail view