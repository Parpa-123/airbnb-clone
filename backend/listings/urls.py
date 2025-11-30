from django.urls import path
from .views import ListingView, ListingDetailView, PublicListingView
from django.conf import settings
from django.conf.urls.static import static

app_name = "listing"

urlpatterns = [
    path("", ListingView.as_view(), name="listings-list"),
    path("<int:pk>/", ListingDetailView.as_view(), name="property-details"),
    path("public/", PublicListingView.as_view(), name="public-listings"),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
