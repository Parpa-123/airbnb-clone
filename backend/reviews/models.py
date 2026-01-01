from django.db import models
from users.base_models import TimeStampedModel
from django.conf import settings
from django.utils import timezone
from django.db.models import Q

class Review(TimeStampedModel):
    review = models.TextField()
    accuracy = models.IntegerField()
    communication = models.IntegerField()
    cleanliness = models.IntegerField()
    location = models.IntegerField()
    check_in = models.IntegerField()
    value = models.IntegerField()
    listing = models.ForeignKey("listings.Listings", on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    

    def get_avg_rating(self):
        return (self.accuracy + self.communication + self.cleanliness + self.location + self.check_in + self.value) / 6
    

    def __str__(self):
        return f"{self.review} - {self.listing.title} - {self.user.username}"

    class Meta:
        verbose_name = "Review"
        verbose_name_plural = "Reviews"
        unique_together = ("listing", "user")


    


