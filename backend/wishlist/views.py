from rest_framework import generics, views
from drf_spectacular.utils import extend_schema
from rest_framework.response import Response
from rest_framework import status
from users.base_views import AuthAPIView
from .serializers import WishlistSerializer, WishlistDetailSerializer, BulkAddToWishlistSerializer
from .models import Wishlist
from listings.models import Listings
from django.shortcuts import get_object_or_404
# Create your views here.

class WishlistListView(AuthAPIView,generics.ListCreateAPIView):
    serializer_class = WishlistSerializer
    queryset = Wishlist.objects.all()

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class WishlistDetailView(AuthAPIView,generics.RetrieveDestroyAPIView):
    serializer_class = WishlistDetailSerializer
    lookup_field = "slug"
    
    def get_queryset(self):
        return Wishlist.objects.filter(user=self.request.user)

class DeleteListingFromWishlistView(AuthAPIView,generics.DestroyAPIView):
    serializer_class = WishlistSerializer
    

    def delete(self, request, *args, **kwargs):
        wishlist_slug = kwargs.get("slug")
        title_slug = kwargs.get("title_slug")
        
        # Get the wishlist that belongs to the user
        wishlist = get_object_or_404(Wishlist, slug=wishlist_slug, user=request.user)
        
        # Get the listing to remove by title_slug
        listing = get_object_or_404(Listings, title_slug=title_slug)
        
        # Remove the listing from the wishlist
        wishlist.listings.remove(listing)
        
        return Response(status=status.HTTP_204_NO_CONTENT)

        
class BulkAddToWishlistView(AuthAPIView,views.APIView):
    
    @extend_schema(request=BulkAddToWishlistSerializer)
    def post(self, request):
        serializer = BulkAddToWishlistSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        
        listing = serializer.validated_data['listing_obj']
        wishlists = serializer.validated_data['wishlists_qs']

        added = []

        for wishlist in wishlists:
            if wishlist.listings.filter(pk=listing.pk).exists():
                continue
            wishlist.listings.add(listing)
            added.append(wishlist.slug)
        
        return Response({"added": added}, status=status.HTTP_200_OK)


