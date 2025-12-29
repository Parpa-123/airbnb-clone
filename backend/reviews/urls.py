from django.urls import path
from .views import ReviewListCreate

app_name = "reviews"

urlpatterns = [
    path("<slug:title_slug>", ReviewListCreate.as_view(), name="review-list-create"),
]
