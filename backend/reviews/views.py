from rest_framework import generics
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django.shortcuts import get_object_or_404
from .models import Review
from .serializers import ReviewSerializer
from listings.models import Listings


class ReviewListCreate(generics.ListCreateAPIView):
    
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        title_slug = self.kwargs.get("title_slug")
        if not title_slug or getattr(self, 'swagger_fake_view', False):
             return Review.objects.none()
        listing = get_object_or_404(Listings, title_slug=title_slug)
        return Review.objects.filter(listing=listing)

    def perform_create(self, serializer):
        listing = get_object_or_404(Listings, title_slug=self.kwargs["title_slug"])
        serializer.save(user=self.request.user, listing=listing)