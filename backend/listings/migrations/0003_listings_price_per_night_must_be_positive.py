from django.conf import settings

from django.db import migrations, models

class Migration(migrations.Migration):

    dependencies = [

        ('listings', '0002_initial'),

        migrations.swappable_dependency(settings.AUTH_USER_MODEL),

    ]

    operations = [

        migrations.AddConstraint(

            model_name='listings',

            constraint=models.CheckConstraint(condition=models.Q(('price_per_night__gte', 0)), name='price_per_night_must_be_positive'),

        ),

    ]
