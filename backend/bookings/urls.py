from django.urls import path

from .views import (
    BookingCreateView,
    BookingListView,

    HostBookingListView,

    BookingDestroyView,

    CreateCashfreeOrderView,

    CashfreeWebhookView,

    BookingDetailView,

    BookingDetailRetrieveView,

    VerifyCashfreePaymentView,

)

app_name = "bookings"

urlpatterns = [

    path("detail/<int:pk>/", BookingDetailRetrieveView.as_view(), name="booking-detail-retrieve"),

    path("create/", BookingCreateView.as_view(), name="booking-create"),

    path("view/", BookingListView.as_view(), name="booking-list"),

    path("host/", HostBookingListView.as_view(), name="host-booking-list"),

    path("delete/<int:pk>/", BookingDestroyView.as_view(), name="booking-delete"),

    path("payments/create-order/", CreateCashfreeOrderView.as_view(), name="payment-create-order"),

    path("payments/webhook/", CashfreeWebhookView.as_view(), name="cashfree-webhook"),

    path("payments/verify/", VerifyCashfreePaymentView.as_view(), name="payment-verify"),

    path('<int:pk>/', BookingDetailView.as_view(), name='booking-detail'),

]
