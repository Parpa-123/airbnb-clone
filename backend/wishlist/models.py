from django.db import models

from django.conf import settings

from listings.models import Listings

from users.base_models import TimeStampedModel

from django.utils.text import slugify

class Wishlist(TimeStampedModel):

    name = models.CharField(max_length=100)

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    listings = models.ManyToManyField(Listings, blank=True)

    slug = models.SlugField(unique=True, blank=True)

    def save(self, *args, **kwargs):

        if not self.slug:

            self.slug = slugify(self.name)

        super().save(*args, **kwargs)

    class Meta:

        verbose_name = "Wishlist"

        verbose_name_plural = "Wishlists"

        constraints = [

            models.UniqueConstraint(

                fields=["user", "name"],

                name="unique_wishlist_name_per_user",

            )

        ]

    def __str__(self):

        return self.name
