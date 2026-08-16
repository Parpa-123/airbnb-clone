from django.urls import path

from .views import (
    ListingView,
    ListingDetailView,
    PublicListingView,
    OptionsView,
    PrivateListingView,
    ListingEditView,
    ListingDeleteView,
    ListingImageUploadView,
    ListingImageDeleteView,
)

app_name = "listing"

urlpatterns = [

    path("", ListingView.as_view(), name="listings-list"),

    path("public/", PublicListingView.as_view(), name="public-listings"),

    path("private/", PrivateListingView.as_view(), name="private-listings"),

    path("choices/form-option/", OptionsView.as_view(), name="form-options"),

    path("<int:id>/edit/", ListingEditView.as_view(), name="property-edit"),

    path("<int:pk>/delete/", ListingDeleteView.as_view(), name="property-delete"),

    path("<int:listing_id>/images/", ListingImageUploadView.as_view(), name="property-images-upload"),

    path("images/<int:image_id>/", ListingImageDeleteView.as_view(), name="property-images-delete"),

    path("<slug:title_slug>/", ListingDetailView.as_view(), name="property-details"),

]
