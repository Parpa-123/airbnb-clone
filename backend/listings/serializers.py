from rest_framework import serializers
from decimal import Decimal
import base64
from django.core.files.base import ContentFile

from .models import Listings, ListingImages, Amenities
from users.models import User




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
    images = ListingImageSerializer(many=True, read_only=True, source="listingimages")
    property_type_display = serializers.CharField(source='get_property_type_display', read_only=True)

    class Meta:
        model = Listings
        fields = [
            "id",
            "host",
            "title",
            "title_slug",
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
# Serializer for handling base64 image uploads
# ============================================================

class Base64ImageSerializer(serializers.Serializer):
    """Serializer to handle base64 encoded images from frontend"""
    name = serializers.CharField(max_length=100)
    image_data = serializers.CharField()

    def validate_image_data(self, value):
        """Validate and decode base64 image"""
        try:
            # Check if it's a data URL (e.g., "data:image/png;base64,...")
            if value.startswith('data:'):
                # Extract the base64 part
                header, encoded = value.split(',', 1)
            else:
                encoded = value
            
            # Try to decode
            base64.b64decode(encoded)
            return value
        except Exception as e:
            raise serializers.ValidationError(f"Invalid base64 image data: {str(e)}")


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

    images = Base64ImageSerializer(many=True, required=False, write_only=True)

    # Required text fields
    title = serializers.CharField(max_length=255, required=True)
    description = serializers.CharField(required=True)
    address = serializers.CharField(max_length=255, required=True)
    country = serializers.CharField(max_length=100, required=True)
    city = serializers.CharField(max_length=100, required=True)

    # Proper choice fields - use correct field types
    property_type = serializers.ChoiceField(choices=Listings.PROPERTY_TYPES, required=True)
    max_guests = serializers.IntegerField(required=True)
    bhk_choice = serializers.IntegerField(required=True)
    bed_choice = serializers.IntegerField(required=True)
    bathrooms = serializers.DecimalField(
        max_digits=3,
        decimal_places=1,
        required=True
    )

    price_per_night = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        coerce_to_string=False,
        min_value=0,
        required=True,
        error_messages={
            "min_value": "Price must be greater than 0"
        }
    )

    class Meta:
        model = Listings
        fields = [
            "id",
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
    # VALIDATION
    # -----------------------------------------
    def validate_max_guests(self, value):
        """Validate max_guests is within allowed choices."""
        valid_choices = [choice[0] for choice in Listings.GUEST_COUNT_CHOICES]
        if value not in valid_choices:
            raise serializers.ValidationError(
                f"Invalid choice. Valid options are: {valid_choices}"
            )
        return value

    def validate_bhk_choice(self, value):
        """Validate bhk_choice is within allowed choices."""
        valid_choices = [choice[0] for choice in Listings.BEDROOM_CHOICES]
        if value not in valid_choices:
            raise serializers.ValidationError(
                f"Invalid choice. Valid options are: {valid_choices}"
            )
        return value

    def validate_bed_choice(self, value):
        """Validate bed_choice is within allowed choices."""
        valid_choices = [choice[0] for choice in Listings.BED_CHOICES]
        if value not in valid_choices:
            raise serializers.ValidationError(
                f"Invalid choice. Valid options are: {valid_choices}"
            )
        return value

    def validate_bathrooms(self, value):
        """Validate bathrooms is within allowed choices."""
        valid_choices = [choice[0] for choice in Listings.BATHROOM_CHOICES]
        if value not in valid_choices:
            raise serializers.ValidationError(
                f"Invalid choice. Valid options are: {valid_choices}"
            )
        return value

    # -----------------------------------------
    # Helper method to decode base64 image
    # -----------------------------------------
    def _decode_base64_image(self, image_data_str):
        """Decode base64 string to image file"""
        try:
            # Check if it's a data URL
            if image_data_str.startswith('data:'):
                # Extract format and base64 data
                header, encoded = image_data_str.split(',', 1)
                # Extract image format from header (e.g., "data:image/png;base64")
                format_part = header.split(';')[0].split('/')[1]
                ext = format_part.lower()
            else:
                encoded = image_data_str
                ext = 'jpg'  # default extension
            
            # Decode base64
            decoded_file = base64.b64decode(encoded)
            return ContentFile(decoded_file), ext
        except Exception as e:
            raise serializers.ValidationError(f"Error decoding image: {str(e)}")

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

        # Add images (decode base64)
        for idx, img_data in enumerate(images_data):
            image_file, ext = self._decode_base64_image(img_data["image_data"])
            filename = f"{img_data['name']}.{ext}"
            
            # Create ListingImage instance
            listing_image = ListingImages(
                listings=listing,
                name=img_data["name"]
            )
            # Save the image file with proper filename
            listing_image.image.save(filename, image_file, save=True)

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
            for idx, img_data in enumerate(images_data):
                image_file, ext = self._decode_base64_image(img_data["image_data"])
                filename = f"{img_data['name']}.{ext}"
                
                # Create ListingImage instance
                listing_image = ListingImages(
                    listings=instance,
                    name=img_data["name"]
                )
                # Save the image file with proper filename
                listing_image.image.save(filename, image_file, save=True)

        return instance

    # -----------------------------------------
    # Return full details after save
    # -----------------------------------------
    def to_representation(self, instance):
        return ListingDetailSerializer(instance, context=self.context).data


