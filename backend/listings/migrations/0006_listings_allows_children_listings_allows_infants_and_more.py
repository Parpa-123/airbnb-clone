from django.db import migrations, models

class Migration(migrations.Migration):

    dependencies = [

        ("listings", "0005_listings_unique_host_address"),

    ]

    operations = [

        migrations.AddField(

            model_name="listings",

            name="allows_children",

            field=models.BooleanField(default=True),

        ),

        migrations.AddField(

            model_name="listings",

            name="allows_infants",

            field=models.BooleanField(default=True),

        ),

        migrations.AddField(

            model_name="listings",

            name="allows_pets",

            field=models.BooleanField(default=False),

        ),

        migrations.AddField(

            model_name="listings",

            name="pet_fee",

            field=models.DecimalField(decimal_places=2, default=0, max_digits=6),

        ),

    ]
