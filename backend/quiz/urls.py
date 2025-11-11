from django.urls import path
from .views import (
    QuestionListView,
    StartQuizSessionView,
    SubmitQuizView,
    UserQuizHistoryView,
    UserQuizStatsView,
    AdminQuestionListView,
    AdminQuestionDetailView,
    AdminQuizStatsView,
)

app_name = 'quiz'

urlpatterns = [
    # 用户功能
    path('questions/', QuestionListView.as_view(), name='question-list'),
    path('start/', StartQuizSessionView.as_view(), name='start-quiz'),
    path('submit/', SubmitQuizView.as_view(), name='submit-quiz'),
    path('history/', UserQuizHistoryView.as_view(), name='user-quiz-history'),
    path('stats/', UserQuizStatsView.as_view(), name='user-quiz-stats'),
    
    # 管理员功能
    path('admin/questions/', AdminQuestionListView.as_view(), name='admin-question-list'),
    path('admin/questions/<int:pk>/', AdminQuestionDetailView.as_view(), name='admin-question-detail'),
    path('admin/stats/', AdminQuizStatsView.as_view(), name='admin-quiz-stats'),
]
