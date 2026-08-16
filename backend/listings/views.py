import os
from rest_framework import generics, permissions, views, status

from rest_framework.response import Response

from rest_framework_simplejwt.authentication import JWTAuthentication

from drf_spectacular.utils import extend_schema, OpenApiParameter, extend_schema_view

from drf_spectacular.types import OpenApiTypes

from listings.models import Listings, Amenities, ListingImages

from listings.serializers import (
    ListingSerializer,
    ListingDetailSerializer,
    CreateUpdateListSerializer,
    ListingImageSerializer,
    ListingImageUploadSerializer,
)

from listings.filters import ListingFilter

from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page

class BaseAuthenticatedView:

    authentication_classes = [JWTAuthentication]

    permission_classes = [permissions.IsAuthenticated]

class ListingView(BaseAuthenticatedView, generics.ListCreateAPIView):

    serializer_class = ListingSerializer

    def get_queryset(self):

        if getattr(self, "swagger_fake_view", False) or self.request.user.is_anonymous:

            return Listings.objects.none()

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

    authentication_classes = []
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

    authentication_classes = []
    permission_classes = [permissions.AllowAny]

    filterset_class = ListingFilter

class OptionsView(BaseAuthenticatedView, views.APIView):

    @extend_schema(responses={200: OpenApiTypes.OBJECT})
    @method_decorator(cache_page(60 * 60 * 24))
    def get(self, request):

        return Response({

            'property_options' : [

                {'value':v[0],'label':v[1]} for v in Listings.PROPERTY_TYPES

            ],

            'amenities' : [

                {'value':v[0],'label':v[1]} for v in Amenities.AMENITY_CHOICES

            ],

            'bedroom_options' : [

                {'value':v[0],'label':v[1]} for v in Listings.BEDROOM_CHOICES

            ],

            'guest_options' : [

                {'value':v[0],'label':v[1]} for v in Listings.GUEST_COUNT_CHOICES

            ],

            'bed_options' : [

                {'value':v[0],'label':v[1]} for v in Listings.BED_CHOICES

            ],

        })

class PrivateListingView(BaseAuthenticatedView, generics.ListAPIView):

    serializer_class = ListingSerializer

    def get_queryset(self):

        if getattr(self, "swagger_fake_view", False) or self.request.user.is_anonymous:

             return Listings.objects.none()

        return Listings.objects.filter(host=self.request.user).order_by("-id")

class ListingEditView(BaseAuthenticatedView, generics.RetrieveUpdateAPIView):

    serializer_class = CreateUpdateListSerializer

    def get_object(self):

        return Listings.objects.get(id=self.kwargs["id"])

class ListingDeleteView(BaseAuthenticatedView, generics.DestroyAPIView):

    serializer_class = ListingSerializer

    def get_queryset(self):

        return Listings.objects.filter(host=self.request.user)


class ListingImageUploadView(BaseAuthenticatedView, views.APIView):
    """
    Dedicated endpoint to upload one or more images directly to a listing.
    POST /api/listings/<listing_id>/images/
    """
    @extend_schema(
        request=ListingImageUploadSerializer,
        responses={201: ListingImageSerializer(many=True)}
    )
    def post(self, request, listing_id):
        try:
            listing = Listings.objects.get(id=listing_id, host=request.user)
        except Listings.DoesNotExist:
            return Response(
                {"detail": "Listing not found or you are not the host."},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = ListingImageUploadSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        images = serializer.validated_data["images"]
        current_count = listing.listingimages.count()
        if current_count + len(images) > 5:
            return Response(
                {"images": f"Listing already has {current_count} images. Maximum 5 images allowed per listing."},
                status=status.HTTP_400_BAD_REQUEST
            )

        created_images = []
        for img in images:
            img_name = os.path.splitext(img.name)[0]
            obj = ListingImages.objects.create(
                listings=listing,
                name=img_name,
                image=img
            )
            created_images.append(obj)

        return Response(
            ListingImageSerializer(created_images, many=True).data,
            status=status.HTTP_201_CREATED
        )


class ListingImageDeleteView(BaseAuthenticatedView, views.APIView):
    """
    Dedicated endpoint to delete a specific image from a listing by image ID.
    DELETE /api/listings/images/<image_id>/
    """
    @extend_schema(responses={204: None})
    def delete(self, request, image_id):
        try:
            image = ListingImages.objects.get(id=image_id, listings__host=request.user)
        except ListingImages.DoesNotExist:
            return Response(
                {"detail": "Image not found or you are not the host of this listing."},
                status=status.HTTP_404_NOT_FOUND
            )

        image.delete()  # triggers post_delete signal to destroy Cloudinary asset
        return Response(status=status.HTTP_204_NO_CONTENT)

