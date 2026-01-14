import django.db.models.deletion

from django.conf import settings

from django.db import migrations, models

class Migration(migrations.Migration):

    initial = True

    dependencies = [

        ('listings', '0001_initial'),

        migrations.swappable_dependency(settings.AUTH_USER_MODEL),

    ]

    operations = [

        migrations.AddField(

            model_name='listings',

            name='host',

            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='listings', to=settings.AUTH_USER_MODEL),

        ),

        migrations.AddField(

            model_name='listingimages',

            name='listings',

            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='listingimages', to='listings.listings'),

        ),

    ]
