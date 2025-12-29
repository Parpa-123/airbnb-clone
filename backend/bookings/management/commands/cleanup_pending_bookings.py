"""
Django management command to cleanup abandoned pending bookings.

Usage:
    python manage.py cleanup_pending_bookings

This command auto-cancels pending bookings that are older than 30 minutes.
Should be run periodically via cron job or task scheduler.
"""
from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from bookings.models import Bookings


class Command(BaseCommand):
    help = "Cancel pending bookings older than 30 minutes"

    def add_arguments(self, parser):
        parser.add_argument(
            '--minutes',
            type=int,
            default=30,
            help='Age threshold in minutes (default: 30)',
        )

    def handle(self, *args, **options):
        threshold_minutes = options['minutes']
        cutoff_time = timezone.now() - timedelta(minutes=threshold_minutes)
        
        # Find pending bookings older than threshold
        old_pending_bookings = Bookings.objects.filter(
            status=Bookings.STATUS_PENDING,
            created_at__lt=cutoff_time
        )
        
        count = old_pending_bookings.count()
        
        if count == 0:
            self.stdout.write(
                self.style.SUCCESS(f'No pending bookings older than {threshold_minutes} minutes')
            )
            return
        
        # Update status to cancelled
        old_pending_bookings.update(status=Bookings.STATUS_CANCELLED)
        
        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully cancelled {count} abandoned booking(s) older than {threshold_minutes} minutes'
            )
        )
