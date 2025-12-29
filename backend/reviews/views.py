from rest_framework import generics
from django.shortcuts import get_object_or_404
from .models import Review
from .serializers import ReviewSerializer
from listings.views import BaseAuthenticatedView
from listings.models import Listings


class ReviewListCreate(BaseAuthenticatedView, generics.ListCreateAPIView):
    
    serializer_class = ReviewSerializer
    
    def get_queryset(self):
        listing = get_object_or_404(Listings, title_slug=self.kwargs["title_slug"])
        return Review.objects.filter(listing=listing)

    def perform_create(self, serializer):
        listing = get_object_or_404(Listings, title_slug=self.kwargs["title_slug"])
        serializer.save(user=self.request.user, listing=listing)