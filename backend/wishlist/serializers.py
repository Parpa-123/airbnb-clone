from rest_framework import serializers
from .models import Wishlist
from listings.serializers import ListingSerializer


# Create your tests here.

class WishlistSerializer(serializers.ModelSerializer):
    slug = serializers.SlugField(read_only=True)
    count = serializers.SerializerMethodField()
    cover_image = serializers.SerializerMethodField()
    class Meta:
        model = Wishlist
        fields = (
            'slug',
            'name',
            'count',
            'cover_image',
        )

    def get_count(self, obj):
        return obj.listings.count()
    
    def get_cover_image(self, obj):
        first_listing = obj.listings.first()
        if not first_listing:
            return None
        
        first_image = first_listing.listingimages.first()
        if not first_image or not first_image.image:
            return None
        
        return self.context.get('request').build_absolute_uri(first_image.image.url) if self.context.get('request') else first_image.image.url

    def validate(self,attrs):
        user = attrs.get("user")
        name = attrs.get("name")
        if Wishlist.objects.filter(user=user,name=name).exists():
            raise serializers.ValidationError("Wishlist with this name already exists")
        return attrs


class WishlistDetailSerializer(serializers.ModelSerializer):

    listings = ListingSerializer(many=True)
    
    class Meta:
        model = Wishlist
        fields = (
            'slug',
            'name',
            'listings',
        )



