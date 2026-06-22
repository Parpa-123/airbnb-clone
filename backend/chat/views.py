from django.db.models import Q, OuterRef, Subquery
from rest_framework import generics, permissions, status
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.response import Response

from rest_framework_simplejwt.authentication import JWTAuthentication

from listings.models import Listings
from conf.pagination import ChatRoomsPagination, ChatMessagesPagination

from .models import Room, Message

from .serializers import RoomSerializer, MessageSerializer


class BaseAuthenticatedView:

    authentication_classes = [JWTAuthentication]

    permission_classes = [permissions.IsAuthenticated]


class ListingRoomCreateView(BaseAuthenticatedView, generics.GenericAPIView):

    serializer_class = RoomSerializer
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "chat_room_create"

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
    pagination_class = ChatRoomsPagination
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "chat_rooms_list"

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False) or self.request.user.is_anonymous:
            return Room.objects.none()
        last_message_queryset = Message.objects.filter(room_id=OuterRef("pk")).order_by("-created_at")
        return (
            Room.objects
            .select_related("listing", "listing__host", "host", "guest")
            .prefetch_related("listing__listingimages")
            .annotate(
                last_message_id=Subquery(last_message_queryset.values("id")[:1]),
                last_message_content=Subquery(last_message_queryset.values("content")[:1]),
                last_message_created_at=Subquery(last_message_queryset.values("created_at")[:1]),
                last_message_updated_at=Subquery(last_message_queryset.values("updated_at")[:1]),
                last_message_user_id=Subquery(last_message_queryset.values("user_id")[:1]),
                last_message_username=Subquery(last_message_queryset.values("user__username")[:1]),
                last_message_user_email=Subquery(last_message_queryset.values("user__email")[:1]),
            )
            .filter(Q(host=self.request.user) | Q(guest=self.request.user))
        )


class MessageListView(BaseAuthenticatedView, generics.ListAPIView):

    serializer_class = MessageSerializer
    pagination_class = ChatMessagesPagination
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "chat_messages_list"

    def get_queryset(self):
        room_id = self.kwargs.get("room_id")
        if getattr(self, "swagger_fake_view", False) or self.request.user.is_anonymous:
            return Message.objects.none()
        return Message.objects.filter(
            room_id=room_id,
        ).filter(
            Q(room__host=self.request.user) | Q(room__guest=self.request.user)
        ).select_related("user", "room")
