from django.urls import path
from .views import ListingView, ListingDetailView, PublicListingView, OptionsView, PrivateListingView, ListingEditView

app_name = "listing"

urlpatterns = [
    path("", ListingView.as_view(), name="listings-list"),
    path("public/", PublicListingView.as_view(), name="public-listings"),
    path("private/", PrivateListingView.as_view(), name="private-listings"),
    path("choices/form-option/", OptionsView.as_view(), name="form-options"),
    path("<int:id>/edit/", ListingEditView.as_view(), name="property-edit"),
    path("<slug:title_slug>/", ListingDetailView.as_view(), name="property-details"),
]