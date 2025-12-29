import django_filters as df
from .models import Listings


class ListingFilter(df.FilterSet):
    country = df.CharFilter(
        field_name="country",
        lookup_expr="icontains"
    )
    city = df.CharFilter(
        field_name="city",
        lookup_expr="icontains"
    )
    property_type = df.CharFilter(
        field_name="property_type",
        lookup_expr="exact"
    )
    price_per_night__gte = df.NumberFilter(
        field_name="price_per_night",
        lookup_expr="gte"
    )
    price_per_night__lte = df.NumberFilter(
        field_name="price_per_night",
        lookup_expr="lte"
    )
    max_guests__gte = df.NumberFilter(
        field_name="max_guests",
        lookup_expr="gte"
    )
    max_guests__lte = df.NumberFilter(
        field_name="max_guests",
        lookup_expr="lte"
    )

    class Meta:
        model = Listings
        fields = [
            "country",
            "city",
            "property_type",
            "price_per_night__gte",
            "price_per_night__lte",
            "max_guests__gte",
            "max_guests__lte",
        ]
