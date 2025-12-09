import django_filters as df
from .models import Listings

class ListingFilter(df.FilterSet):
    class Meta:
        model = Listings
        fields = {
            'country' : ['exact'],
            'city' : ['exact'],
            'property_type' : ['exact'],
            'price_per_night' : ['lte', 'gte'],
            'max_guests' : ['lte', 'gte'],
        }