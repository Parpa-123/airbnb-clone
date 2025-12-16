from django.urls import path
from .views import BookingCreateView, BookingListView, BookingDestroyView

app_name = "bookings"

urlpatterns = [
    path("create/", BookingCreateView.as_view(), name="booking-create"),
    path("view/", BookingListView.as_view(), name="booking-list"),
    path("delete/<int:pk>/", BookingDestroyView.as_view(), name="booking-delete"),
]