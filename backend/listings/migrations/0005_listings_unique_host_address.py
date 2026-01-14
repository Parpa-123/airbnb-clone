from django.conf import settings

from django.db import migrations, models

class Migration(migrations.Migration):

    dependencies = [

        ("listings", "0004_rename_uploaded_at_listingimages_created_at_and_more"),

        migrations.swappable_dependency(settings.AUTH_USER_MODEL),

    ]

    operations = [

        migrations.AddConstraint(

            model_name="listings",

            constraint=models.UniqueConstraint(

                fields=("host", "address"), name="unique_host_address"

            ),

        ),

    ]
