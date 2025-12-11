from django.db.models.signals import post_save
from django.dispatch import receiver
from listings.models import Listings


@receiver(post_save, sender=Listings)
def update_host_status(sender, instance, created, **kwargs):
    if created:
        instance.host.is_host = True
        instance.host.save()