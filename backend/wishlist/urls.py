from django.urls import path

from .views import WishlistListView, WishlistDetailView, DeleteListingFromWishlistView, BulkAddToWishlistView

app_name = "wishlist"

urlpatterns = [

    path("", WishlistListView.as_view(), name="wishlist-list"),

    path("bulk-add-to-wishlist/", BulkAddToWishlistView.as_view(), name="bulk-add-to-wishlist"),

    path("<slug:slug>/", WishlistDetailView.as_view(), name="wishlist-detail"),

    path("<slug:slug>/delete/<slug:title_slug>", DeleteListingFromWishlistView.as_view(), name="delete-listing-from-wishlist"),

]
