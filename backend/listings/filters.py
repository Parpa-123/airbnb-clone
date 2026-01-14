import django_filters as df

from .models import Listings

from django.db.models import Q

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

    check_in = df.DateFilter(

        method="filter_available_listings",

    )

    check_out = df.DateFilter(

        method="filter_available_listings"

    )

    has_pets = df.BooleanFilter(method="filter_allows_pets")

    has_children = df.BooleanFilter(method="filter_allows_children")

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

            "has_pets",

            "has_children",

        ]

    def filter_available_listings(self, queryset, name, value):

        check_in = self.data.get("check_in")

        check_out = self.data.get("check_out")

        if not check_in or not check_out:

            return queryset

        return queryset.exclude(

            Q(bookings__start_date__lt=check_out) &

            Q(bookings__end_date__gt=check_in) &

            Q(bookings__status__in=["confirmed", "paid"])

        )

    def filter_allows_pets(self, queryset, name, value):

        if value:

            return queryset.filter(allows_pets=True)

        return queryset

    def filter_allows_children(self, queryset, name, value):

        if value:

            return queryset.filter(allows_children=True)

        return queryset
