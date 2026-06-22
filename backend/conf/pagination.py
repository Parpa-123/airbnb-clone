from rest_framework.pagination import PageNumberPagination


class DefaultPagePagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = "page_size"
    max_page_size = 100


class ListingsPagination(DefaultPagePagination):
    page_size = 24
    max_page_size = 100


class ChatRoomsPagination(DefaultPagePagination):
    page_size = 20
    max_page_size = 100


class ChatMessagesPagination(DefaultPagePagination):
    page_size = 50
    max_page_size = 200


class BookingsPagination(DefaultPagePagination):
    page_size = 20
    max_page_size = 100
