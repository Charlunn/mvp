from django.conf import settings
from django.db import models


class ChatSimulationResult(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="chat_simulation_result",
    )
    scenario_type = models.CharField(max_length=64)
    difficulty = models.CharField(max_length=32)
    mode = models.CharField(max_length=32)
    final_score = models.IntegerField()
    conversation_rounds = models.PositiveIntegerField()
    end_reason = models.CharField(max_length=32)
    performance_analysis = models.TextField()
    suggestions = models.TextField()
    capability_profile = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user} - {self.scenario_type} ({self.final_score})"
