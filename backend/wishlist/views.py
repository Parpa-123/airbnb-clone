from rest_framework import generics, views

from drf_spectacular.utils import extend_schema

from rest_framework.response import Response

from rest_framework import status

from users.base_views import AuthAPIView

from .serializers import WishlistSerializer, WishlistDetailSerializer, BulkAddToWishlistSerializer

from .models import Wishlist

from listings.models import Listings

from django.shortcuts import get_object_or_404
from django.db.models import Count, Prefetch

class WishlistListView(AuthAPIView,generics.ListCreateAPIView):

    serializer_class = WishlistSerializer

    queryset = Wishlist.objects.all()

    def get_queryset(self):

        listing_queryset = Listings.objects.select_related("host").prefetch_related("listingimages")
        return (
            self.queryset
            .filter(user=self.request.user)
            .annotate(listings_count=Count("listings", distinct=True))
            .prefetch_related(
                Prefetch(
                    "listings",
                    queryset=listing_queryset,
                    to_attr="prefetched_listings_for_cover",
                )
            )
        )

    def perform_create(self, serializer):

        serializer.save(user=self.request.user)

class WishlistDetailView(AuthAPIView,generics.RetrieveDestroyAPIView):

    serializer_class = WishlistDetailSerializer

    lookup_field = "slug"

    def get_queryset(self):

        listing_queryset = Listings.objects.select_related("host").prefetch_related("listingimages")
        return Wishlist.objects.filter(user=self.request.user).prefetch_related(
            Prefetch("listings", queryset=listing_queryset)
        )

class DeleteListingFromWishlistView(AuthAPIView,generics.DestroyAPIView):

    serializer_class = WishlistSerializer

    def delete(self, request, *args, **kwargs):

        wishlist_slug = kwargs.get("slug")

        title_slug = kwargs.get("title_slug")

        wishlist = get_object_or_404(Wishlist, slug=wishlist_slug, user=request.user)

        listing = get_object_or_404(Listings, title_slug=title_slug)

        wishlist.listings.remove(listing)

        return Response(status=status.HTTP_204_NO_CONTENT)

class BulkAddToWishlistView(AuthAPIView, generics.GenericAPIView):

    serializer_class = BulkAddToWishlistSerializer

    @extend_schema(request=BulkAddToWishlistSerializer)

    def post(self, request):

        serializer = BulkAddToWishlistSerializer(data=request.data, context={'request': request})

        serializer.is_valid(raise_exception=True)

        listing = serializer.validated_data['listing_obj']

        wishlists = serializer.validated_data['wishlists_qs']

        through_model = Wishlist.listings.through
        wishlist_pairs = list(wishlists.values("id", "slug"))
        wishlist_ids = [item["id"] for item in wishlist_pairs]

        existing_wishlist_ids = set(
            through_model.objects.filter(
                wishlist_id__in=wishlist_ids,
                listings_id=listing.pk,
            ).values_list("wishlist_id", flat=True)
        )

        to_create = [
            through_model(wishlist_id=wishlist_id, listings_id=listing.pk)
            for wishlist_id in wishlist_ids
            if wishlist_id not in existing_wishlist_ids
        ]
        if to_create:
            through_model.objects.bulk_create(to_create, ignore_conflicts=True)

        added = [
            item["slug"]
            for item in wishlist_pairs
            if item["id"] not in existing_wishlist_ids
        ]

        return Response({"added": added}, status=status.HTTP_200_OK)
