from django.conf import settings

from django.db import migrations

class Migration(migrations.Migration):

    dependencies = [

        ("listings", "0004_rename_uploaded_at_listingimages_created_at_and_more"),

        ("reviews", "0002_alter_review_unique_together"),

        migrations.swappable_dependency(settings.AUTH_USER_MODEL),

    ]

    operations = [

        migrations.AlterUniqueTogether(

            name="review",

            unique_together={("listing", "user")},

        ),

    ]
