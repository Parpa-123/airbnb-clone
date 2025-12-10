from rest_framework import generics
from .models import Bookings
from .serializers import CreateBookingSerializer, PublicBookingSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

# Create your views here.

class CreateBookingView(generics.CreateAPIView):
    queryset = Bookings.objects.all()
    serializer_class = CreateBookingSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(guest=self.request.user)
