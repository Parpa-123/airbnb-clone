from django.db import migrations, models

class Migration(migrations.Migration):

    dependencies = [

        ('bookings', '0001_initial'),

    ]

    operations = [

        migrations.AddField(

            model_name='bookings',

            name='cashfree_order_id',

            field=models.CharField(blank=True, max_length=100, null=True),

        ),

        migrations.AddField(

            model_name='bookings',

            name='payment_session_id',

            field=models.CharField(blank=True, max_length=200, null=True),

        ),

        migrations.AlterField(

            model_name='bookings',

            name='status',

            field=models.CharField(choices=[('pending', 'Pending'), ('confirmed', 'Confirmed'), ('cancelled', 'Cancelled'), ('paid', 'Paid'), ('failed', 'Failed')], default='pending', max_length=20),

        ),

    ]
