from django.contrib import admin

from .models import ChatSimulationResult


@admin.register(ChatSimulationResult)
class ChatSimulationResultAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "scenario_type",
        "difficulty",
        "mode",
        "final_score",
        "conversation_rounds",
        "end_reason",
        "created_at",
    )
    search_fields = ("user__username", "scenario_type")
