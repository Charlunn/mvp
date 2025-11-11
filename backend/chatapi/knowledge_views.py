#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .knowledge_service import knowledge_service
import logging
import json

logger = logging.getLogger(__name__)

class FraudRiskAnalysisView(APIView):
    """诈骗风险分析API"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        """分析文本的诈骗风险"""
        try:
            if hasattr(request, 'data') and request.data:
                data = request.data
            else:
                data = json.loads(request.body)
            text = data.get('text', '')
            
            if not text:
                return Response(
                    {'success': False, 'message': '请提供要分析的文本'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # 调用知识图谱服务分析风险
            risk_analysis = knowledge_service.analyze_fraud_risk(text)
            
            return Response({
                'success': True,
                'data': risk_analysis
            }, status=status.HTTP_200_OK)
            
        except json.JSONDecodeError:
            return Response(
                {'success': False, 'message': '无效的JSON格式'},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.error(f"诈骗风险分析失败: {e}")
            return Response(
                {'success': False, 'message': '分析失败，请稍后重试'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class FraudTypeInfoView(APIView):
    """诈骗类型详细信息API"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request, fraud_type_name):
        """获取特定诈骗类型的详细信息"""
        try:
            fraud_info = knowledge_service.get_fraud_type_info(fraud_type_name)
            
            if not fraud_info:
                return Response(
                    {'success': False, 'message': '未找到该诈骗类型'},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            return Response({
                'success': True,
                'data': fraud_info
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"获取诈骗类型信息失败: {e}")
            return Response(
                {'success': False, 'message': '获取信息失败，请稍后重试'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class KnowledgeSearchView(APIView):
    """知识图谱搜索API"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """搜索知识图谱"""
        try:
            query = request.GET.get('q', '')
            
            if not query:
                return Response(
                    {'success': False, 'message': '请提供搜索关键词'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            search_results = knowledge_service.search_knowledge(query)
            
            return Response({
                'success': True,
                'data': search_results
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"知识图谱搜索失败: {e}")
            return Response(
                {'success': False, 'message': '搜索失败，请稍后重试'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class PreventionSuggestionsView(APIView):
    """防范建议API"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """获取防范建议"""
        try:
            # 可选：基于特定关键词获取针对性建议
            keywords = request.GET.getlist('keywords')
            
            suggestions = knowledge_service.get_prevention_suggestions(keywords if keywords else None)
            
            return Response({
                'success': True,
                'data': {'suggestions': suggestions}
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"获取防范建议失败: {e}")
            return Response(
                {'success': False, 'message': '获取建议失败，请稍后重试'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class FraudTypesListView(APIView):
    """诈骗类型列表API"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """获取所有诈骗类型列表"""
        try:
            fraud_types = knowledge_service.get_all_fraud_types()
            
            return Response({
                'success': True,
                'data': {'fraud_types': fraud_types}
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"获取诈骗类型列表失败: {e}")
            return Response(
                {'success': False, 'message': '获取列表失败，请稍后重试'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class KnowledgeStatsView(APIView):
    """知识图谱统计信息API"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """获取知识图谱统计信息"""
        try:
            from graph_api.db_utils import get_neo4j_driver
            
            driver = get_neo4j_driver()
            if not driver:
                return Response(
                    {'success': False, 'message': '知识图谱服务不可用'},
                    status=status.HTTP_503_SERVICE_UNAVAILABLE
                )
            
            with driver.session() as session:
                # 获取各类型节点数量
                stats = {}
                
                # 总节点数
                result = session.run("MATCH (n) RETURN count(n) as total_nodes")
                stats['total_nodes'] = result.single()['total_nodes']
                
                # 总关系数
                result = session.run("MATCH ()-[r]->() RETURN count(r) as total_relationships")
                stats['total_relationships'] = result.single()['total_relationships']
                
                # 各类型节点数量
                node_types = ['FraudType', 'FraudMethod', 'PreventionMeasure', 'Keyword']
                type_names = {'FraudType': '诈骗类型', 'FraudMethod': '诈骗手段', 'PreventionMeasure': '防范措施', 'Keyword': '风险关键词'}
                
                stats['node_types'] = {}
                for node_type in node_types:
                    result = session.run(f"MATCH (n:{node_type}) RETURN count(n) as count")
                    count = result.single()['count']
                    stats['node_types'][type_names[node_type]] = count
                
                return Response({
                    'success': True,
                    'data': stats
                }, status=status.HTTP_200_OK)
                
        except Exception as e:
            logger.error(f"获取知识图谱统计信息失败: {e}")
            return Response(
                {'success': False, 'message': '获取统计信息失败，请稍后重试'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )