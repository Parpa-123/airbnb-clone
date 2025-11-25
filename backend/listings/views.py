from rest_framework import generics, authentication, permissions
from rest_framework_simplejwt.authentication import JWTAuthentication
from listings.models import Listings
from listings.serializers import ListingSerializer


class ListingView(generics.ListCreateAPIView):
    serializer_class = ListingSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Listings.objects.filter(host=self.request.user).order_by('-id')

    def perform_create(self, serializer):
        serializer.save(host=self.request.user)
