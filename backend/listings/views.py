from rest_framework import generics, permissions, views
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from drf_spectacular.utils import extend_schema, OpenApiParameter, extend_schema_view
from listings.models import Listings, Amenities
from listings.serializers import ListingSerializer, ListingDetailSerializer, CreateUpdateListSerializer
from listings.filters import ListingFilter


# ============================================================
# Base Authentication Mixin
# ============================================================

class BaseAuthenticatedView:
    """Base class providing JWT authentication and default serializer"""
    
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]


# ============================================================
# Listing Views
# ============================================================

class ListingView(BaseAuthenticatedView, generics.ListCreateAPIView):
    """List and create listings for authenticated users"""
    serializer_class = ListingSerializer
    def get_queryset(self):
        return Listings.objects.filter(host=self.request.user).order_by("-id")

    def get_serializer_class(self):
        if self.request.method == "POST":
            return CreateUpdateListSerializer
        return ListingSerializer
    
    @extend_schema(
        request=CreateUpdateListSerializer,
        responses={201: ListingDetailSerializer}
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)
    
    


class ListingDetailView(generics.RetrieveAPIView):
    queryset = Listings.objects.all()
    serializer_class = ListingDetailSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'title_slug'



@extend_schema_view(
    list = extend_schema(
        parameters=[
            OpenApiParameter(
                name="country",
                description="Filter listings by country",
                required=False,
                type=str
            ),
            OpenApiParameter(
                name="city",
                description="Filter listings by city",
                required=False,
                type=str
            ),
            OpenApiParameter(
                name="price",
                description="Filter listings by price",
                required=False,
                type=str
            ),
            OpenApiParameter(
                name="guests",
                description="Filter listings by number of guests",
                required=False,
                type=str
            ),
        ]
    )
)
class PublicListingView(generics.ListAPIView):
    queryset = Listings.objects.all().order_by("-id")
    serializer_class = ListingSerializer
    permission_classes = [permissions.AllowAny]
    filterset_class = ListingFilter

class OptionsView(BaseAuthenticatedView, views.APIView):
    """Get form options for authenticated users"""
    
    def get(self, request):
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

class PrivateListingView(BaseAuthenticatedView, generics.ListAPIView):
    """List all listings for the authenticated user"""
    serializer_class = ListingSerializer
    
    def get_queryset(self):
        return Listings.objects.filter(host=self.request.user).order_by("-id")


class ListingEditView(BaseAuthenticatedView, generics.RetrieveUpdateAPIView):
    """Update a specific listing for the authenticated user"""
    serializer_class = CreateUpdateListSerializer
    
    def get_object(self):
        return Listings.objects.get(id=self.kwargs["id"])
