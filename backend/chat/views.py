from django.db.models import Q
from rest_framework import generics, permissions, status
from rest_framework.response import Response

from rest_framework_simplejwt.authentication import JWTAuthentication

from listings.models import Listings

from .models import Room, Message

from .serializers import RoomSerializer, MessageSerializer


class BaseAuthenticatedView:

    authentication_classes = [JWTAuthentication]

    permission_classes = [permissions.IsAuthenticated]


class ListingRoomCreateView(BaseAuthenticatedView, generics.GenericAPIView):

    serializer_class = RoomSerializer

    def post(self, request, listing_id):
        listing = generics.get_object_or_404(
            Listings.objects.select_related("host"),
            id=listing_id,
        )

        if listing.host == request.user:
            return Response(
                {"detail": "Hosts cannot start a chat with themselves."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        room, _ = Room.objects.get_or_create(
            listing=listing,
            host=listing.host,
            guest=request.user,
            defaults={"name": f"{listing.title} chat"},
        )
        room.sync_participants()

        serializer = self.get_serializer(room)
        return Response(serializer.data, status=status.HTTP_200_OK)


class RoomListView(BaseAuthenticatedView, generics.ListAPIView):

    serializer_class = RoomSerializer

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False) or self.request.user.is_anonymous:
            return Room.objects.none()
        return (
            Room.objects
            .select_related("listing", "host", "guest")
            .prefetch_related("listing__listingimages", "messages")
            .filter(Q(host=self.request.user) | Q(guest=self.request.user))
        )


class MessageListView(BaseAuthenticatedView, generics.ListAPIView):

    serializer_class = MessageSerializer

    def get_queryset(self):
        room_id = self.kwargs.get("room_id")
        if getattr(self, "swagger_fake_view", False) or self.request.user.is_anonymous:
            return Message.objects.none()
        return Message.objects.filter(
            room_id=room_id,
        ).filter(
            Q(room__host=self.request.user) | Q(room__guest=self.request.user)
        ).select_related("user", "room")
