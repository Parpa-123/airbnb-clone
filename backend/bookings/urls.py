from django.urls import path
from .views import (
    BookingCreateView, 
    BookingListView, 
    BookingDestroyView,
    CreateCashfreeOrderView,
    CashfreeWebhookView,
    BookingDetailView,
    BookingDetailRetrieveView,
    
)

app_name = "bookings"

urlpatterns = [
    # Specific patterns first
    path("detail/<int:pk>/", BookingDetailRetrieveView.as_view(), name="booking-detail-retrieve"),
    path("create/", BookingCreateView.as_view(), name="booking-create"),
    path("view/", BookingListView.as_view(), name="booking-list"),
    path("delete/<int:pk>/", BookingDestroyView.as_view(), name="booking-delete"),
    path("payments/create-order/", CreateCashfreeOrderView.as_view()),
    path("payments/webhook/", CashfreeWebhookView.as_view(), name="cashfree-webhook"),

    
    # Generic pattern last
    path('<int:pk>/', BookingDetailView.as_view(), name='booking-detail'),
]