from django.urls import path
from .views import ListingView

app_name = "listing"

urlpatterns = [
    path("listings/", ListingView.as_view(), name="listings-list"),
]
