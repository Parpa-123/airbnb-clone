import django.db.models.deletion

from django.db import migrations, models

class Migration(migrations.Migration):

    dependencies = [

        ('bookings', '0003_remove_bookings_cashfree_order_id_and_more'),

    ]

    operations = [

        migrations.AlterField(

            model_name='bookings',

            name='status',

            field=models.CharField(choices=[('pending', 'Pending'), ('confirmed', 'Confirmed'), ('cancelled', 'Cancelled'), ('paid', 'Paid'), ('failed', 'Failed'), ('refunded', 'Refunded'), ('ongoing', 'Ongoing')], default='pending', max_length=20),

        ),

        migrations.CreateModel(

            name='Payment',

            fields=[

                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),

                ('amount', models.DecimalField(decimal_places=2, max_digits=10)),

                ('gateway', models.CharField(default='cashfree', max_length=50)),

                ('order_id', models.CharField(max_length=255, unique=True)),

                ('payment_session_id', models.CharField(blank=True, max_length=255, null=True)),

                ('transaction_id', models.CharField(blank=True, max_length=255, null=True)),

                ('status', models.CharField(choices=[('initiated', 'Initiated'), ('paid', 'Paid'), ('failed', 'Failed'), ('refunded', 'Refunded')], max_length=20)),

                ('created_at', models.DateTimeField(auto_now_add=True)),

                ('booking', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='payments', to='bookings.bookings')),

            ],

        ),

    ]
