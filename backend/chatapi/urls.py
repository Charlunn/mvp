# chatapi/urls.py
app_name = 'chat_api'  # 定义应用命名空间

from django.urls import path
from . import views
from . import knowledge_views
from .views import (
    ChatAPIView,
    ChatHistoryView,
    ScenarioChatAPIView,
    ScenarioChatStatelessAPIView,
    ChatSessionsView,
    GenerateReportAPIView,
    LatestSimulationResultAPIView,
)

urlpatterns = [
    path('', views.chat_api_view, name='chat_api'),
    path('scenario/', views.ScenarioChatAPIView.as_view(), name='scenario_chat_api'),
    path('scenario/stateless/', ScenarioChatStatelessAPIView.as_view(), name='scenario_chat_stateless'),
    path('latest-result/', LatestSimulationResultAPIView.as_view(), name='latest_chat_result'),
    path('history/', views.ChatHistoryView.as_view(), name='chat_history'),
    path('sessions/', views.ChatSessionsView.as_view(), name='chat_sessions'),
    path('generate-report/', GenerateReportAPIView.as_view(), name='generate_report'),
    
    # 知识图谱相关API
    path('knowledge/risk-analysis/', knowledge_views.FraudRiskAnalysisView.as_view(), name='fraud_risk_analysis'),
    path('knowledge/fraud-type/<str:fraud_type_name>/', knowledge_views.FraudTypeInfoView.as_view(), name='fraud_type_info'),
    path('knowledge/search/', knowledge_views.KnowledgeSearchView.as_view(), name='knowledge_search'),
    path('knowledge/prevention-suggestions/', knowledge_views.PreventionSuggestionsView.as_view(), name='prevention_suggestions'),
    path('knowledge/fraud-types/', knowledge_views.FraudTypesListView.as_view(), name='fraud_types_list'),
    path('knowledge/stats/', knowledge_views.KnowledgeStatsView.as_view(), name='knowledge_stats'),
]
