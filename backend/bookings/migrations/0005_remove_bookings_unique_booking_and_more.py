from django.conf import settings

from django.db import migrations, models

class Migration(migrations.Migration):

    dependencies = [

        ('bookings', '0004_alter_bookings_status_payment'),

        ('listings', '0004_rename_uploaded_at_listingimages_created_at_and_more'),

        migrations.swappable_dependency(settings.AUTH_USER_MODEL),

    ]

    operations = [

        migrations.RemoveConstraint(

            model_name='bookings',

            name='unique_booking',

        ),

        migrations.AddConstraint(

            model_name='bookings',

            constraint=models.UniqueConstraint(condition=models.Q(('status__in', ['confirmed', 'paid'])), fields=('guest', 'listing', 'start_date', 'end_date'), name='unique_confirmed_booking'),

        ),

    ]
