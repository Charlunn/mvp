from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("chatapi", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="chatsimulationresult",
            name="capability_profile",
            field=models.JSONField(blank=True, default=dict),
        ),
    ]
