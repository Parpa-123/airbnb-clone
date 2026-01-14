from django.db import migrations, models

class Migration(migrations.Migration):

    dependencies = [

        ('listings', '0003_listings_price_per_night_must_be_positive'),

    ]

    operations = [

        migrations.RenameField(

            model_name='listingimages',

            old_name='uploaded_at',

            new_name='created_at',

        ),

        migrations.AddField(

            model_name='listingimages',

            name='updated_at',

            field=models.DateTimeField(auto_now=True),

        ),

    ]
