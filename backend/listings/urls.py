from django.urls import path
from .views import ListingView, ListingDetailView, PublicListingView

app_name = "listing"

urlpatterns = [
    path("", ListingView.as_view(), name="listings-list"),
    path("<int:pk>/", ListingDetailView.as_view(), name="property-details"),
    path("public/", PublicListingView.as_view(), name="public-listings"),
]
