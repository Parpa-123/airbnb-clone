import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


def clear_legacy_rooms(apps, schema_editor):
    Room = apps.get_model("chat", "Room")
    Room.objects.filter(listing__isnull=True).delete()


class Migration(migrations.Migration):

    dependencies = [
        ("chat", "0001_initial"),
        ("listings", "0009_alter_listingimages_image"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AlterField(
            model_name="room",
            name="name",
            field=models.CharField(blank=True, max_length=255),
        ),
        migrations.AddField(
            model_name="room",
            name="guest",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="guest_chat_rooms",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.AddField(
            model_name="room",
            name="host",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="host_chat_rooms",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.AddField(
            model_name="room",
            name="listing",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="chat_rooms",
                to="listings.listings",
            ),
        ),
        migrations.RunPython(clear_legacy_rooms, migrations.RunPython.noop),
        migrations.AlterField(
            model_name="room",
            name="guest",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="guest_chat_rooms",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.AlterField(
            model_name="room",
            name="host",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="host_chat_rooms",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.AlterField(
            model_name="room",
            name="listing",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="chat_rooms",
                to="listings.listings",
            ),
        ),
        migrations.AddConstraint(
            model_name="room",
            constraint=models.UniqueConstraint(
                fields=("listing", "host", "guest"),
                name="unique_listing_host_guest_room",
            ),
        ),
        migrations.AddConstraint(
            model_name="room",
            constraint=models.CheckConstraint(
                check=~models.Q(host_id=models.F("guest_id")),
                name="room_host_guest_must_differ",
            ),
        ),
    ]
