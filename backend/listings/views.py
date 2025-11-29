from rest_framework import generics, permissions
from rest_framework_simplejwt.authentication import JWTAuthentication
from listings.models import Listings
from listings.serializers import ListingSerializer, ListingDetailSerializer, CreateUpdateListSerializer


class ListingView(generics.ListCreateAPIView):
    serializer_class = ListingSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    # Only show the logged-in user's listings
    def get_queryset(self):
        return Listings.objects.filter(host=self.request.user).order_by("-id")

    # Assign the logged-in user as the host when creating
    def get_serializer_class(self):
        if self.request.method == "POST":
            return CreateUpdateListSerializer
        return ListingSerializer
    
    def perform_create(self, serializer):
        serializer.save(host=self.request.user)


class ListingDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = ListingDetailSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    
    def get_queryset(self):
        return Listings.objects.filter(host=self.request.user)

    def get_serializer_class(self):
        if self.request.method in ["PUT", "PATCH"]:
            return CreateUpdateListSerializer
        return ListingDetailSerializer
    
class PublicListingView(generics.ListAPIView):
    queryset = Listings.objects.all().order_by("-id")
    serializer_class = ListingSerializer
    permission_classes = [permissions.AllowAny]

