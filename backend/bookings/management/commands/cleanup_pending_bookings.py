from django.core.management.base import BaseCommand

from django.utils import timezone
from django.db.models import Q

from bookings.models import Bookings

class Command(BaseCommand):

    help = 'Cancel pending bookings whose hold has expired'

    def handle(self, *args, **options):

        now = timezone.now()

        pending_bookings = Bookings.objects.filter(

            status=Bookings.STATUS_PENDING,
        ).filter(
            Q(hold_expires_at__lte=now) | Q(hold_expires_at__isnull=True)

        )

        count = pending_bookings.count()

        if count > 0:

            pending_bookings.update(status=Bookings.STATUS_CANCELLED)

            self.stdout.write(

                self.style.SUCCESS(f'Successfully cancelled {count} pending booking(s)')

            )

        else:

            self.stdout.write(

                self.style.SUCCESS('No pending bookings to cancel')

            )
