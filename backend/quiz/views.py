from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_list_or_404
from django.db.models import Q, Avg, Max, Count
from django.contrib.auth import get_user_model
import logging

from .models import Question, QuizAttempt, QuizSession
from .serializers import (
    QuestionSerializer,
    AdminQuestionSerializer,
    QuizAttemptSerializer,
    QuizSubmissionSerializer,
    UserQuizStatsSerializer,
)
from utils.permissions import IsAdminUser

User = get_user_model()
logger = logging.getLogger(__name__)


class QuestionListView(generics.ListAPIView):
    """获取题目列表"""
    serializer_class = QuestionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        level = self.request.query_params.get('level')
        limit = self.request.query_params.get('limit', 10)

        queryset = Question.objects.all()
        if level:
            queryset = queryset.filter(level=level)

        # 先进行随机排序，再进行切片
        queryset = queryset.order_by('?')

        try:
            limit = int(limit)
            if limit > 0:
                queryset = queryset[:limit]
        except (ValueError, TypeError):
            queryset = queryset[:10]

        return queryset


class StartQuizSessionView(APIView):
    """创建一次新的测验会话"""
    permission_classes = [permissions.IsAuthenticated]
    MAX_LIMIT = 10
    DEFAULT_LIMIT = 5

    def post(self, request):
        level = request.data.get('level')
        limit = request.data.get('limit', self.DEFAULT_LIMIT)

        valid_levels = {choice[0] for choice in Question.LEVEL_CHOICES}
        if level not in valid_levels:
            return Response({'detail': '请选择有效的测验难度'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            limit = int(limit)
        except (TypeError, ValueError):
            limit = self.DEFAULT_LIMIT

        limit = max(1, min(limit, self.MAX_LIMIT))

        question_qs = list(Question.objects.filter(level=level).order_by('?')[:limit])
        if not question_qs:
            return Response({'detail': '当前难度暂无可用题目'}, status=status.HTTP_404_NOT_FOUND)

        session = QuizSession.objects.create(
            user=request.user,
            level=level,
            question_ids=[question.id for question in question_qs],
            total_questions=len(question_qs),
        )

        serializer = QuestionSerializer(question_qs, many=True)
        logger.info(
            "Quiz session %s created for user %s with %s questions",
            session.id,
            request.user.id,
            len(question_qs),
        )
        return Response(
            {
                'session_id': session.id,
                'level': level,
                'total_questions': len(question_qs),
                'questions': serializer.data,
            },
            status=status.HTTP_201_CREATED,
        )


class SubmitQuizView(APIView):
    """提交答题"""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            serializer = QuizSubmissionSerializer(data=request.data)
            if not serializer.is_valid():
                logger.warning(f"User {request.user.id} submitted invalid quiz data: {serializer.errors}")
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
            answers = serializer.validated_data['answers']
            level = serializer.validated_data['level']
            session_id = serializer.validated_data['session_id']

            try:
                session = QuizSession.objects.get(id=session_id, user=request.user)
            except QuizSession.DoesNotExist:
                logger.warning("User %s submitted quiz for missing session %s", request.user.id, session_id)
                return Response({'detail': '测验会话不存在或已过期'}, status=status.HTTP_404_NOT_FOUND)

            if session.completed:
                return Response({'detail': '本次测验已提交，请开启新的会话'}, status=status.HTTP_400_BAD_REQUEST)

            if session.level != level:
                logger.warning(
                    "User %s attempted to submit mismatched level session %s (expected %s, got %s)",
                    request.user.id,
                    session.id,
                    session.level,
                    level,
                )
                return Response({'detail': '测验难度与会话不符，请刷新后重试'}, status=status.HTTP_400_BAD_REQUEST)

            normalized_answers = {}
            for q_id, choice in answers.items():
                try:
                    normalized_answers[int(q_id)] = choice
                except (TypeError, ValueError):
                    logger.warning("User %s provided invalid question id %s", request.user.id, q_id)

            available_questions = Question.objects.filter(id__in=session.question_ids)
            question_map = {question.id: question for question in available_questions}
            ordered_question_ids = [q_id for q_id in session.question_ids if q_id in question_map]

            if not ordered_question_ids:
                logger.error("Session %s for user %s has no valid questions", session.id, request.user.id)
                return Response({'detail': '本次测验题目已失效，请重新开始'}, status=status.HTTP_409_CONFLICT)

            correct_answers = 0
            question_results = []

            for q_id in ordered_question_ids:
                question = question_map[q_id]
                user_choice = normalized_answers.get(q_id)
                user_choice_normalized = user_choice.upper() if user_choice else None
                is_correct = bool(user_choice_normalized and question.correct_answer.upper() == user_choice_normalized)
                if is_correct:
                    correct_answers += 1

                question_results.append(
                    {
                        'question_id': q_id,
                        'user_answer': user_choice_normalized,
                        'correct_answer': question.correct_answer,
                        'is_correct': is_correct,
                    }
                )

            total_questions = len(ordered_question_ids)
            score = int((correct_answers / total_questions) * 100) if total_questions > 0 else 0

            quiz_attempt = QuizAttempt.objects.create(
                user=request.user,
                level=level,
                score=score,
                total_questions=total_questions,
                correct_answers=correct_answers,
            )
            session.mark_completed(quiz_attempt)

            logger.info(
                "User %s completed quiz session %s (level: %s, score: %s)",
                request.user.id,
                session.id,
                level,
                score,
            )

            return Response(
                {
                    'attempt_id': quiz_attempt.id,
                    'session_id': session.id,
                    'score': score,
                    'correct_answers': correct_answers,
                    'total_questions': total_questions,
                    'accuracy': round((correct_answers / total_questions) * 100, 2) if total_questions > 0 else 0,
                    'question_results': question_results,
                }
            )
        except Exception as e:
            logger.error(f"Error submitting quiz for user {request.user.id}: {e}")
            return Response({'detail': 'An error occurred while submitting quiz'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UserQuizHistoryView(generics.ListAPIView):
    """用户答题历史"""
    serializer_class = QuizAttemptSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = QuizAttempt.objects.filter(user=self.request.user).order_by('-created_at')
        
        level = self.request.query_params.get('level')
        if level:
            queryset = queryset.filter(level=level)
            
        return queryset


class UserQuizStatsView(APIView):
    """用户答题统计"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        try:
            user = request.user
            attempts = QuizAttempt.objects.filter(user=user)
            
            if not attempts.exists():
                logger.info(f"User {user.id} has no quiz attempts")
                return Response({
                    'total_attempts': 0,
                    'average_score': 0,
                    'best_score': 0,
                    'level_stats': {},
                    'recent_attempts': []
                })
            
            # 基本统计
            total_attempts = attempts.count()
            average_score = attempts.aggregate(avg_score=Avg('score'))['avg_score'] or 0
            best_score = attempts.aggregate(max_score=Max('score'))['max_score'] or 0
            
            # 按难度级别统计
            level_stats = {}
            for level in ['beginner', 'intermediate', 'advanced']:
                level_attempts = attempts.filter(level=level)
                if level_attempts.exists():
                    level_stats[level] = {
                        'attempts': level_attempts.count(),
                        'average_score': level_attempts.aggregate(avg=Avg('score'))['avg'] or 0,
                        'best_score': level_attempts.aggregate(max=Max('score'))['max'] or 0
                    }
                else:
                    level_stats[level] = {
                        'attempts': 0,
                        'average_score': 0,
                        'best_score': 0
                    }
            
            # 最近的答题记录
            recent_attempts = attempts.order_by('-created_at')[:5]
            
            serializer = UserQuizStatsSerializer({
                'total_attempts': total_attempts,
                'average_score': round(average_score, 2),
                'best_score': best_score,
                'level_stats': level_stats,
                'recent_attempts': recent_attempts
            })
            
            logger.info(f"Retrieved quiz stats for user {user.id}")
            return Response(serializer.data)
        except Exception as e:
            logger.error(f"Error retrieving quiz stats for user {request.user.id}: {e}")
            return Response({'detail': 'An error occurred while retrieving quiz stats'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class AdminQuestionListView(generics.ListCreateAPIView):
    """管理员题目管理"""
    serializer_class = AdminQuestionSerializer
    permission_classes = [IsAdminUser]
    
    def get_queryset(self):
        queryset = Question.objects.all()
        
        # 搜索功能
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(text__icontains=search) |
                Q(option_a__icontains=search) |
                Q(option_b__icontains=search) |
                Q(option_c__icontains=search) |
                Q(option_d__icontains=search)
            )
        
        # 按难度筛选
        level = self.request.query_params.get('level')
        if level:
            queryset = queryset.filter(level=level)
            
        return queryset.order_by('id')


class AdminQuestionDetailView(generics.RetrieveUpdateDestroyAPIView):
    """管理员题目详情管理"""
    queryset = Question.objects.all()
    serializer_class = AdminQuestionSerializer
    permission_classes = [IsAdminUser]


class AdminQuizStatsView(APIView):
    """管理员答题统计"""
    permission_classes = [IsAdminUser]
    
    def get(self, request):
        try:
            from django.utils import timezone
            from datetime import timedelta
            
            now = timezone.now()
            today = now.date()
            week_ago = today - timedelta(days=7)
            month_ago = today - timedelta(days=30)
            
            # 基本统计
            total_questions = Question.objects.count()
            total_attempts = QuizAttempt.objects.count()
            total_users = QuizAttempt.objects.values('user').distinct().count()
            
            # 时间统计
            today_attempts = QuizAttempt.objects.filter(created_at__date=today).count()
            week_attempts = QuizAttempt.objects.filter(created_at__date__gte=week_ago).count()
            month_attempts = QuizAttempt.objects.filter(created_at__date__gte=month_ago).count()
            
            # 难度级别统计
            level_stats = {}
            for level in ['beginner', 'intermediate', 'advanced']:
                level_questions = Question.objects.filter(level=level).count()
                level_attempts = QuizAttempt.objects.filter(level=level)
                level_stats[level] = {
                    'questions': level_questions,
                    'attempts': level_attempts.count(),
                    'average_score': level_attempts.aggregate(avg=Avg('score'))['avg'] or 0
                }
            
            # 平均分统计
            overall_average = QuizAttempt.objects.aggregate(avg=Avg('score'))['avg'] or 0
            
            logger.info(f"Admin user {request.user.id} retrieved quiz statistics")
            
            return Response({
                'total_questions': total_questions,
                'total_attempts': total_attempts,
                'total_users': total_users,
                'today_attempts': today_attempts,
                'week_attempts': week_attempts,
                'month_attempts': month_attempts,
                'overall_average_score': round(overall_average, 2),
                'level_stats': level_stats
            })
        except Exception as e:
            logger.error(f"Error retrieving admin quiz stats for user {request.user.id}: {e}")
            return Response({'detail': 'An error occurred while retrieving quiz statistics'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
