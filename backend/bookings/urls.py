from django.urls import path
from .views import BookingListCreateView,BookingRetrieveUpdateDestroyView

app_name = "bookings"

urlpatterns = [
    path("create/", BookingListCreateView.as_view(), name="booking-list-create"),
    path('delete/<int:pk>/', BookingRetrieveUpdateDestroyView.as_view(), name="booking-delete"),
]