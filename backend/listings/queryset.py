from django.db.models import QuerySet, Q

class ListingsQuerySet(QuerySet):

    def with_listing_card_relations(self):
        return self.select_related("host").prefetch_related("listingimages")

    def with_listing_detail_relations(self):
        return self.with_listing_card_relations().prefetch_related("amenities")

    def get_available_listings(self, start_date, end_date):

        return self.exclude(

            Q(bookings__start_date__lt=end_date) & 
            Q(bookings__end_date__gt=start_date) & 
            Q(bookings__status__in=["confirmed", "paid"])

        ).distinct()
