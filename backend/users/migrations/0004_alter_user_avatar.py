import cloudinary.models

from django.db import migrations

class Migration(migrations.Migration):

    dependencies = [

        ("users", "0003_alter_user_avatar"),

    ]

    operations = [

        migrations.AlterField(

            model_name="user",

            name="avatar",

            field=cloudinary.models.CloudinaryField(

                blank=True, max_length=255, null=True, verbose_name="avatar"

            ),

        ),

    ]
