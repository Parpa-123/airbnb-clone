from rest_framework import serializers
from drf_spectacular.utils import extend_schema_field
from .models import Wishlist
from listings.serializers import ListingSerializer
from listings.models import Listings

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

    @extend_schema_field(serializers.IntegerField)
    def get_count(self, obj):
        return obj.listings.count()
    
    @extend_schema_field(serializers.URLField)
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


class BulkAddToWishlistSerializer(serializers.Serializer):
    listing = serializers.CharField()
    wishlist = serializers.ListField(
        child = serializers.SlugField(),
    )

    def validate(self,attrs):
        user = self.context.get('request').user
        listing = attrs.get('listing')
        wishlist = attrs.get('wishlist')
        
        try:
            listing = Listings.objects.get(title_slug=listing)
        except Listings.DoesNotExist:
            raise serializers.ValidationError("Listing not found")
        
        wishlists = Wishlist.objects.filter(user=user,slug__in=wishlist)

        if not wishlists.exists():
            raise serializers.ValidationError("Wishlist not found")

        attrs['listing_obj'] = listing
        attrs['wishlists_qs'] = wishlists

        return attrs



