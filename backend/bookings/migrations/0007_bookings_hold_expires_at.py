from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("bookings", "0006_bookings_adults_bookings_children_bookings_infants_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="bookings",
            name="hold_expires_at",
            field=models.DateTimeField(blank=True, db_index=True, null=True),
        ),
    ]
