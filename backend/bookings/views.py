from rest_framework import generics

from users.base_views import AuthAPIView
from .serializers import BookingSerializer, ViewBookingSerializer
from .models import Bookings

class BookingCreateView(AuthAPIView, generics.CreateAPIView):
    """Handle creating new bookings"""
    serializer_class = BookingSerializer

    def perform_create(self, serializer):
        serializer.save(guest=self.request.user)

class BookingListView(AuthAPIView, generics.ListAPIView):
    """Handle listing user's bookings"""
    serializer_class = ViewBookingSerializer

    def get_queryset(self):
        return Bookings.objects.filter(guest=self.request.user)

class BookingDestroyView(AuthAPIView, generics.DestroyAPIView):
    """Handle deleting/cancelling bookings"""
    serializer_class = BookingSerializer

    def get_queryset(self):
        return Bookings.objects.filter(guest=self.request.user)

