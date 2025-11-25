from rest_framework import serializers
from .models import Listings, ListingImages, Amineties
from users.models import User
from cities_light.models import City
# Create your tests here.


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'username',
            'avatar'
        ]

class ImagesSerializer(serializers.ModelSerializer):
    class Meta:
        model = ListingImages
        fields = [
            'name'
        ]

class AminetiesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Amineties
        fields = [
            'name'
        ]

class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = [
            'name'
        ]


class ListingSerializer(serializers.ModelSerializer):
    images = ImagesSerializer(source="listingimages_set", many=True, read_only=True)
    aminities = AminetiesSerializer(many=True, read_only=True)
    host = UserSerializer(read_only=True)
    city = CitySerializer(read_only=True)

    class Meta:
        model = Listings
        fields = [
            
            "host",
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
            "price",
            "price_per_night",
            "aminities",
            "images",
            "crested_at",
            "update_at",
        ]
