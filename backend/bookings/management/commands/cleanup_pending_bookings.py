from django.core.management.base import BaseCommand

from django.utils import timezone

from datetime import timedelta

from bookings.models import Bookings

class Command(BaseCommand):

    help = 'Cancel pending bookings older than 2 minutes'

    def handle(self, *args, **options):

        cutoff_time = timezone.now() - timedelta(minutes=2)

        pending_bookings = Bookings.objects.filter(

            status=Bookings.STATUS_PENDING,

            created_at__lt=cutoff_time

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
