from django.urls import path

from .views import ListingRoomCreateView, RoomListView, MessageListView

app_name = "chat"

urlpatterns = [

    path("rooms/", RoomListView.as_view(), name="room-list"),

    path("listings/<int:listing_id>/room/", ListingRoomCreateView.as_view(), name="listing-room"),

    path("rooms/<int:room_id>/messages/", MessageListView.as_view(), name="message-list"),

]
