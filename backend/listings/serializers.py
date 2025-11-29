from rest_framework import serializers
from decimal import Decimal

from .models import Listings, ListingImages, Amenities, City
from users.models import User

from django_countries.serializer_fields import CountryField   # <-- correct import


# ============================================================
# Nested Read-Only Serializers
# ============================================================

class HostSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username", "avatar"]


class ListingImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ListingImages
        fields = ["name", "image", "uploaded_at"]
        read_only_fields = ["uploaded_at"]


class CountrySerializer(serializers.Serializer):
    """CountryField is NOT a model, so we use a simple serializer."""
    country = CountryField(read_only=True)


class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = ["id", "name"]


class AmenitySerializer(serializers.ModelSerializer):
    display_name = serializers.CharField(source='get_name_display', read_only=True)

    class Meta:
        model = Amenities
        fields = ["name", "display_name"]


# ============================================================
# Main List Serializer (For Listing View)
# ============================================================

class ListingSerializer(serializers.ModelSerializer):
    host = HostSerializer(read_only=True)
    country = CountryField(read_only=True)   # <-- corrected
    city = CitySerializer(read_only=True)
    images = ListingImageSerializer(many=True, read_only=True, source="listingimages_set")
    property_type_display = serializers.CharField(source='get_property_type_display', read_only=True)

    class Meta:
        model = Listings
        fields = [
            "host",
            "title",
            "country",
            "city",
            "property_type",
            "property_type_display",
            "max_guests",
            "bhk_choice",
            "bed_choice",
            "bathrooms",
            "price_per_night",
            "images",
            "created_at",
        ]
        read_only_fields = ["created_at"]


# ============================================================
# Detailed Read Serializer (For Detail View)
# ============================================================

class ListingDetailSerializer(ListingSerializer):
    amenities = AmenitySerializer(many=True, read_only=True)

    class Meta(ListingSerializer.Meta):
        fields = ListingSerializer.Meta.fields + [
            "description",
            "address",
            "updated_at",
            "amenities",
        ]
        read_only_fields = ListingSerializer.Meta.read_only_fields + ["updated_at"]


# ============================================================
# Writable Nested Image Serializer
# ============================================================

class ImageUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = ListingImages
        fields = ["name", "image"]


# ============================================================
# Create / Update Serializer
# ============================================================

class CreateUpdateListSerializer(serializers.ModelSerializer):

    amenities = serializers.ListField(
        child=serializers.ChoiceField(choices=Amenities.AMENITY_CHOICES),
        required=False,
        allow_empty=True,
        write_only=True
    )

    images = ImageUploadSerializer(many=True, required=False, write_only=True)

    # CORRECT serializer field for CountryField
    country = CountryField(required=False)

    city = serializers.PrimaryKeyRelatedField(
        queryset=City.objects.all(),
        required=False,
        allow_null=True
    )

    # Proper choice fields
    property_type = serializers.ChoiceField(choices=Listings.PROPERTY_TYPES)
    max_guests = serializers.ChoiceField(choices=Listings.GUEST_COUNT_CHOICES)
    bhk_choice = serializers.ChoiceField(choices=Listings.BEDROOM_CHOICES)
    bed_choice = serializers.ChoiceField(choices=Listings.BED_CHOICES)
    bathrooms = serializers.ChoiceField(choices=Listings.BATHROOM_CHOICES)

    price_per_night = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        coerce_to_string=False
    )

    class Meta:
        model = Listings
        fields = [
            "title",
            "description",
            "address",
            "country",
            "city",
            "property_type",
            "max_guests",
            "bhk_choice",
            "bed_choice",
            "bathrooms",
            "price_per_night",
            "amenities",
            "images",
        ]

    # -----------------------------------------
    # CREATE
    # -----------------------------------------
    def create(self, validated_data):
        amenities_data = validated_data.pop("amenities", [])
        images_data = validated_data.pop("images", [])

        listing = Listings.objects.create(
            host=self.context["request"].user,
            **validated_data
        )

        # Add amenities
        for a in amenities_data:
            amenity, _ = Amenities.objects.get_or_create(name=a)
            listing.amenities.add(amenity)

        # Add images
        for img in images_data:
            ListingImages.objects.create(
                listings=listing,
                name=img["name"],
                image=img["image"],
            )

        return listing

    # -----------------------------------------
    # UPDATE
    # -----------------------------------------
    def update(self, instance, validated_data):
        amenities_data = validated_data.pop("amenities", None)
        images_data = validated_data.pop("images", None)

        # Update basic fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Update amenities
        if amenities_data is not None:
            instance.amenities.clear()
            for a in amenities_data:
                amenity, _ = Amenities.objects.get_or_create(name=a)
                instance.amenities.add(amenity)

        # Update images
        if images_data is not None:
            instance.listingimages_set.all().delete()
            for img in images_data:
                ListingImages.objects.create(
                    listings=instance,
                    name=img["name"],
                    image=img["image"],
                )

        return instance

    # -----------------------------------------
    # Return full details after save
    # -----------------------------------------
    def to_representation(self, instance):
        return ListingDetailSerializer(instance, context=self.context).data
