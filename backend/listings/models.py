from django.db import models
from django.conf import settings
from django_countries.fields import CountryField
from cities_light.models import City

class Amineties(models.Model):
    AMENITY_CHOICES = [
        ("wifi", "Wi-Fi"),
        ("tv", "TV"),
        ("kitchen", "Kitchen"),
        ("washer", "Washer"),
        ("dryer", "Dryer"),
        ("air_conditioning", "Air Conditioning"),
        ("heating", "Heating"),
        ("dedicated_workspace", "Dedicated Workspace"),
        ("parking", "Free Parking"),
        ("gym", "Gym"),
        ("pool", "Pool"),
        ("hot_tub", "Hot Tub"),
        ("bbq_grill", "BBQ Grill"),
        ("patio", "Patio or Balcony"),
        ("garden", "Garden"),
        ("smoke_alarm", "Smoke Alarm"),
        ("first_aid_kit", "First Aid Kit"),
        ("fire_extinguisher", "Fire Extinguisher"),
        ("breakfast", "Breakfast Provided"),
        ("pets_allowed", "Pets Allowed"),
        ("long_term_stays", "Long-Term Stays Allowed"),
    ]


    name = models.CharField(max_length = 100, choices= AMENITY_CHOICES)

    def __str__(self):
        return self.name



class Listings(models.Model):

    PROPERTY_TYPES = [
        ("apartment", "Apartment"),
        ("house", "House"),
        ("villa", "Villa"),
        ("hotel", "Hotel Room"),
        ("shared_room", "Shared Room"),
        ("guest_house", "Guest House"),
    ]

    GUEST_COUNT_CHOICES = [(i, str(i)) for i in range(1, 16)]
    BEDROOM_CHOICES = [(i, str(i)) for i in range(1, 11)]
    BED_CHOICES = [(i, str(i)) for i in range(1, 20)]

    BATHROOM_CHOICES = [
        (0.5, "0.5"),
        (1.0, "1.0"),
        (1.5, "1.5"),
        (2.0, "2.0"),
        (2.5, "2.5"),
        (3.0, "3.0"),
        (4.0, "4.0"),
    ]

    host = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    title = models.CharField(max_length = 255)
    description = models.TextField()
    address = models.CharField(max_length = 255)
    country = CountryField(blank_label="(Select country)", blank=True)
    city = models.ForeignKey(City, on_delete=models.SET_NULL, null=True, blank=True)

    property_type = models.CharField(max_length = 15, choices = PROPERTY_TYPES)
    max_guests = models.IntegerField(choices=GUEST_COUNT_CHOICES)
    bhk_choice = models.IntegerField(choices= BEDROOM_CHOICES)
    bed_choice = models.IntegerField(choices = BED_CHOICES)
    bathrooms = models.DecimalField(max_digits=3, decimal_places=1, choices = BATHROOM_CHOICES)
    price = models.DecimalField(max_digits=10,decimal_places=2, blank=True)

    crested_at = models.DateTimeField(auto_now_add=True)
    update_at = models.DateTimeField(auto_now=True)

    aminities = models.ManyToManyField(Amineties)
    price_per_night = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.title

class ListingImages(models.Model):
    name = models.CharField(max_length = 100)
    listings = models.ForeignKey(Listings, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='media/listings')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name