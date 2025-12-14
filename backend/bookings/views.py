from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

from .serializers import BookingSerializer,ViewBookingSerializer
from .models import Bookings

class AuthAPIView:
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

class BookingListCreateView(AuthAPIView,generics.ListCreateAPIView):
    serializer_class = BookingSerializer
    

    def get_queryset(self):
        
        return Bookings.objects.filter(guest=self.request.user)

    def perform_create(self, serializer):
        serializer.save(guest=self.request.user)

class BookingRetrieveUpdateDestroyView(AuthAPIView,generics.DestroyAPIView):
    serializer_class = BookingSerializer
    

    def get_queryset(self):
        return Bookings.objects.filter(guest=self.request.user)

class RetrieveView(AuthAPIView,generics.ListAPIView):
    serializer_class = ViewBookingSerializer
    

    def get_queryset(self):
        return Bookings.objects.filter(guest=self.request.user)

    
