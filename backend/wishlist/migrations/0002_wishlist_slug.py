from django.db import migrations, models

class Migration(migrations.Migration):

    dependencies = [

        ('wishlist', '0001_initial'),

    ]

    operations = [

        migrations.AddField(

            model_name='wishlist',

            name='slug',

            field=models.SlugField(blank=True, unique=True),

        ),

    ]
