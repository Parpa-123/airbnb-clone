from rest_framework import generics, permissions, views
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from listings.models import Listings, Amenities
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
            user = self.request.user
            if not user.is_host:
                user.is_host = True
                user.save()
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

class OptionsView(views.APIView):
    def get(self,request):
        return Response({
            'property_options' : [
                {'value':v[0],'label':v[1]} for v in Listings.PROPERTY_TYPES
            ],

            'aminities' : [
                {'value':v[0],'label':v[1]} for v in Amenities.AMENITY_CHOICES
            ],
            'bedroom_options' : [
                {'value':v[0],'label':v[1]} for v in Listings.BEDROOM_CHOICES
            ],
            'guest_options' : [
                {'value':v[0],'label':v[1]} for v in Listings.GUEST_COUNT_CHOICES
            ],
            'bathroom_options' : [
                {'value':v[0],'label':v[1]} for v in Listings.BATHROOM_CHOICES
            ],
            'bed_options' : [
                {'value':v[0],'label':v[1]} for v in Listings.BED_CHOICES
            ],
        })
