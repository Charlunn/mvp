#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from typing import List, Dict, Any, Optional
import re
from graph_api.db_utils import get_neo4j_driver
import logging

logger = logging.getLogger(__name__)

class KnowledgeGraphService:
    """知识图谱查询服务"""
    
    def __init__(self):
        self.driver = get_neo4j_driver()
    
    def analyze_fraud_risk(self, text: str) -> Dict[str, Any]:
        """分析文本中的诈骗风险"""
        try:
            if not self.driver:
                return {"risk_score": 0, "keywords": [], "fraud_types": [], "suggestions": []}
            
            with self.driver.session() as session:
                # 查找文本中的风险关键词
                keywords_found = []
                total_risk_score = 0
                
                # 获取所有关键词
                result = session.run("MATCH (k:Keyword) RETURN k.word as word, k.risk_score as score, k.category as category")
                keywords = result.data()
                
                # 检查文本中是否包含风险关键词
                text_lower = text.lower()
                for keyword_data in keywords:
                    word = keyword_data['word']
                    if word in text_lower or any(phrase in text_lower for phrase in word.split()):
                        keywords_found.append({
                            'word': word,
                            'risk_score': keyword_data['score'],
                            'category': keyword_data['category']
                        })
                        total_risk_score += keyword_data['score']
                
                # 根据关键词查找相关的诈骗类型
                fraud_types = []
                if keywords_found:
                    keyword_words = [k['word'] for k in keywords_found]
                    result = session.run(
                        "MATCH (k:Keyword)-[:INDICATES]->(f:FraudType) "
                        "WHERE k.word IN $keywords "
                        "RETURN DISTINCT f.name as name, f.description as description, f.risk_level as risk_level",
                        {"keywords": keyword_words}
                    )
                    fraud_types = result.data()
                
                # 获取防范建议
                suggestions = []
                if fraud_types:
                    fraud_type_names = [ft['name'] for ft in fraud_types]
                    result = session.run(
                        "MATCH (p:PreventionMeasure)-[:PREVENTS]->(f:FraudType) "
                        "WHERE f.name IN $fraud_types "
                        "RETURN DISTINCT p.name as name, p.description as description, p.effectiveness as effectiveness",
                        {"fraud_types": fraud_type_names}
                    )
                    suggestions = result.data()
                
                # 计算综合风险评分
                risk_score = min(total_risk_score, 10)  # 最高10分
                
                return {
                    "risk_score": risk_score,
                    "keywords": keywords_found,
                    "fraud_types": fraud_types,
                    "suggestions": suggestions
                }
                
        except Exception as e:
            logger.error(f"分析诈骗风险时出错: {e}")
            return {"risk_score": 0, "keywords": [], "fraud_types": [], "suggestions": []}
    
    def get_fraud_type_info(self, fraud_type_name: str) -> Dict[str, Any]:
        """获取特定诈骗类型的详细信息"""
        try:
            if not self.driver:
                return {}
            
            with self.driver.session() as session:
                # 获取诈骗类型基本信息
                result = session.run(
                    "MATCH (f:FraudType {name: $name}) "
                    "RETURN f.name as name, f.description as description, f.risk_level as risk_level",
                    {"name": fraud_type_name}
                )
                fraud_info = result.single()
                if not fraud_info:
                    return {}
                
                # 获取相关的诈骗手段
                result = session.run(
                    "MATCH (f:FraudType {name: $name})-[:USES_METHOD]->(m:FraudMethod) "
                    "RETURN m.name as name, m.description as description, m.common_phrases as phrases",
                    {"name": fraud_type_name}
                )
                methods = result.data()
                
                # 获取防范措施
                result = session.run(
                    "MATCH (p:PreventionMeasure)-[:PREVENTS]->(f:FraudType {name: $name}) "
                    "RETURN p.name as name, p.description as description, p.effectiveness as effectiveness",
                    {"name": fraud_type_name}
                )
                preventions = result.data()
                
                # 获取相关关键词
                result = session.run(
                    "MATCH (k:Keyword)-[:INDICATES]->(f:FraudType {name: $name}) "
                    "RETURN k.word as word, k.risk_score as score, k.category as category",
                    {"name": fraud_type_name}
                )
                keywords = result.data()
                
                return {
                    "fraud_type": dict(fraud_info),
                    "methods": methods,
                    "preventions": preventions,
                    "keywords": keywords
                }
                
        except Exception as e:
            logger.error(f"获取诈骗类型信息时出错: {e}")
            return {}
    
    def search_knowledge(self, query: str) -> Dict[str, Any]:
        """根据查询搜索知识图谱"""
        try:
            if not self.driver:
                return {"results": []}
            
            with self.driver.session() as session:
                results = []
                
                # 搜索诈骗类型
                result = session.run(
                    "MATCH (f:FraudType) "
                    "WHERE f.name CONTAINS $query OR f.description CONTAINS $query "
                    "RETURN 'FraudType' as type, f.name as name, f.description as description, f.risk_level as risk_level",
                    {"query": query}
                )
                results.extend([{"type": "诈骗类型", **record} for record in result.data()])
                
                # 搜索诈骗手段
                result = session.run(
                    "MATCH (m:FraudMethod) "
                    "WHERE m.name CONTAINS $query OR m.description CONTAINS $query "
                    "RETURN 'FraudMethod' as type, m.name as name, m.description as description",
                    {"query": query}
                )
                results.extend([{"type": "诈骗手段", **record} for record in result.data()])
                
                # 搜索防范措施
                result = session.run(
                    "MATCH (p:PreventionMeasure) "
                    "WHERE p.name CONTAINS $query OR p.description CONTAINS $query "
                    "RETURN 'PreventionMeasure' as type, p.name as name, p.description as description, p.effectiveness as effectiveness",
                    {"query": query}
                )
                results.extend([{"type": "防范措施", **record} for record in result.data()])
                
                # 搜索关键词
                result = session.run(
                    "MATCH (k:Keyword) "
                    "WHERE k.word CONTAINS $query OR k.category CONTAINS $query "
                    "RETURN 'Keyword' as type, k.word as name, k.category as description, k.risk_score as risk_score",
                    {"query": query}
                )
                results.extend([{"type": "风险关键词", **record} for record in result.data()])
                
                return {"results": results}
                
        except Exception as e:
            logger.error(f"搜索知识图谱时出错: {e}")
            return {"results": []}
    
    def get_prevention_suggestions(self, risk_keywords: List[str] = None) -> List[Dict[str, Any]]:
        """获取防范建议"""
        try:
            if not self.driver:
                return []
            
            with self.driver.session() as session:
                if risk_keywords:
                    # 基于风险关键词获取针对性建议
                    result = session.run(
                        "MATCH (k:Keyword)-[:INDICATES]->(f:FraudType)<-[:PREVENTS]-(p:PreventionMeasure) "
                        "WHERE k.word IN $keywords "
                        "RETURN DISTINCT p.name as name, p.description as description, p.effectiveness as effectiveness "
                        "ORDER BY p.effectiveness DESC",
                        {"keywords": risk_keywords}
                    )
                else:
                    # 获取通用防范建议
                    result = session.run(
                        "MATCH (p:PreventionMeasure) "
                        "RETURN p.name as name, p.description as description, p.effectiveness as effectiveness "
                        "ORDER BY p.effectiveness DESC"
                    )
                
                return result.data()
                
        except Exception as e:
            logger.error(f"获取防范建议时出错: {e}")
            return []
    
    def get_all_fraud_types(self) -> List[Dict[str, Any]]:
        """获取所有诈骗类型"""
        try:
            if not self.driver:
                return []
            
            with self.driver.session() as session:
                result = session.run(
                    "MATCH (f:FraudType) "
                    "RETURN f.name as name, f.description as description, f.risk_level as risk_level "
                    "ORDER BY f.risk_level DESC, f.name"
                )
                return result.data()
                
        except Exception as e:
            logger.error(f"获取诈骗类型列表时出错: {e}")
            return []

# 创建全局实例
knowledge_service = KnowledgeGraphService()