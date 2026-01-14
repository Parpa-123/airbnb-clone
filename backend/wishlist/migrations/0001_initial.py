import django.db.models.deletion

from django.conf import settings

from django.db import migrations, models

class Migration(migrations.Migration):

    initial = True

    dependencies = [

        ('listings', '0003_listings_price_per_night_must_be_positive'),

        migrations.swappable_dependency(settings.AUTH_USER_MODEL),

    ]

    operations = [

        migrations.CreateModel(

            name='Wishlist',

            fields=[

                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),

                ('name', models.CharField(max_length=100)),

                ('created_at', models.DateTimeField(auto_now_add=True)),

                ('updated_at', models.DateTimeField(auto_now=True)),

                ('listings', models.ManyToManyField(blank=True, to='listings.listings')),

                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),

            ],

            options={

                'verbose_name': 'Wishlist',

                'verbose_name_plural': 'Wishlists',

                'constraints': [models.UniqueConstraint(fields=('user', 'name'), name='unique_wishlist_name_per_user')],

            },

        ),

    ]
