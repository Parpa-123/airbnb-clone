import cloudinary.models

from django.db import migrations

class Migration(migrations.Migration):

    dependencies = [

        ("listings", "0008_remove_pet_fee"),

    ]

    operations = [

        migrations.AlterField(

            model_name="listingimages",

            name="image",

            field=cloudinary.models.CloudinaryField(

                blank=True, max_length=255, null=True, verbose_name="image"

            ),

        ),

    ]
