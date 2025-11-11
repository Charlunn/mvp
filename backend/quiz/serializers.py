from rest_framework import serializers
from .models import Question, QuizAttempt
from django.contrib.auth import get_user_model

User = get_user_model()


class QuestionSerializer(serializers.ModelSerializer):
    """题目序列化器（不包含正确答案）"""
    class Meta:
        model = Question
        fields = ['id', 'level', 'text', 'option_a', 'option_b', 'option_c', 'option_d']


class AdminQuestionSerializer(serializers.ModelSerializer):
    """管理员题目序列化器（包含正确答案）"""
    class Meta:
        model = Question
        fields = ['id', 'level', 'text', 'option_a', 'option_b', 'option_c', 'option_d', 'correct_answer']


class QuizAttemptSerializer(serializers.ModelSerializer):
    """答题记录序列化器"""
    user_username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = QuizAttempt
        fields = [
            'id', 'user', 'user_username', 'level', 'score', 
            'total_questions', 'correct_answers', 'created_at'
        ]
        read_only_fields = ['id', 'user', 'user_username', 'created_at']


class QuizSubmissionSerializer(serializers.Serializer):
    """答题提交序列化器"""
    level = serializers.CharField(max_length=20)
    session_id = serializers.IntegerField()
    answers = serializers.DictField(
        child=serializers.CharField(max_length=1),
        help_text="格式: {question_id: answer_choice}"
    )
    
    def validate_level(self, value):
        valid_levels = ['beginner', 'intermediate', 'advanced']
        if value not in valid_levels:
            raise serializers.ValidationError(f"Level must be one of: {valid_levels}")
        return value
    
    def validate_answers(self, value):
        if not value:
            raise serializers.ValidationError("Answers cannot be empty")
        
        # 验证答案选项
        valid_choices = ['A', 'B', 'C', 'D']
        for question_id, answer in value.items():
            if answer.upper() not in valid_choices:
                raise serializers.ValidationError(
                    f"Answer for question {question_id} must be one of: {valid_choices}"
                )
        return value
    
    def validate_session_id(self, value):
        if value <= 0:
            raise serializers.ValidationError("Session id must be a positive integer")
        return value


class UserQuizStatsSerializer(serializers.Serializer):
    """用户答题统计序列化器"""
    total_attempts = serializers.IntegerField()
    average_score = serializers.FloatField()
    best_score = serializers.IntegerField()
    level_stats = serializers.DictField()
    recent_attempts = QuizAttemptSerializer(many=True)
