from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="ChatSimulationResult",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("scenario_type", models.CharField(max_length=64)),
                ("difficulty", models.CharField(max_length=32)),
                ("mode", models.CharField(max_length=32)),
                ("final_score", models.IntegerField()),
                ("conversation_rounds", models.PositiveIntegerField()),
                ("end_reason", models.CharField(max_length=32)),
                ("performance_analysis", models.TextField()),
                ("suggestions", models.TextField()),
                ("created_at", models.DateTimeField(auto_now=True)),
                (
                    "user",
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="chat_simulation_result",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
    ]
