from django.db.models import QuerySet, Q


class ListingsQuerySet(QuerySet):
    def get_available_listings(self, start_date, end_date):
        return self.filter(
            Q(bookings__start_date__gte=end_date) | Q(bookings__end_date__lte=start_date) & Q(bookings__status__in=["confirmed", "paid"])
        ).distinct()
