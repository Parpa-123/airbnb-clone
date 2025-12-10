from rest_framework import generics, permissions, views
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from drf_spectacular.utils import extend_schema, OpenApiParameter, extend_schema_view
from listings.models import Listings, Amenities
from listings.serializers import ListingSerializer, ListingDetailSerializer, CreateUpdateListSerializer
from listings.filters import ListingFilter


class ListingView(generics.ListCreateAPIView):
    serializer_class = ListingSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]

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
