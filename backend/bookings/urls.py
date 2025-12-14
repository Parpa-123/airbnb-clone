from django.urls import path
from .views import BookingListCreateView,BookingRetrieveUpdateDestroyView,RetrieveView

app_name = "bookings"

urlpatterns = [
    path("create/", BookingListCreateView.as_view(), name="booking-list-create"),
    path('delete/<int:pk>/', BookingRetrieveUpdateDestroyView.as_view(), name="booking-delete"),
    path('view/', RetrieveView.as_view(), name="booking-view"),
]