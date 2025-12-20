from django.urls import path
from .views import WishlistListView, WishlistDetailView, DeleteListingFromWishlistView

app_name = "wishlist"
urlpatterns = [
    path("", WishlistListView.as_view(), name="wishlist-list"),
    path("<slug:slug>/", WishlistDetailView.as_view(), name="wishlist-detail"),
    path("<slug:slug>/delete/<slug:title_slug>", DeleteListingFromWishlistView.as_view(), name="delete-listing-from-wishlist"),
]