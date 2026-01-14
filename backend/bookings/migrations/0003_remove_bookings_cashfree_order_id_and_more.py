from django.db import migrations

class Migration(migrations.Migration):

    dependencies = [

        ('bookings', '0002_bookings_cashfree_order_id_and_more'),

    ]

    operations = [

        migrations.RemoveField(

            model_name='bookings',

            name='cashfree_order_id',

        ),

        migrations.RemoveField(

            model_name='bookings',

            name='payment_session_id',

        ),

    ]
