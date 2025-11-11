import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from neo4j.exceptions import ServiceUnavailable, CypherSyntaxError, Neo4jError

from .db_utils import (
    read_from_neo4j,
    write_to_neo4j,
    validate_node_exists,
    validate_relationship_exists,
)
from .cypher_queries import (
    # 基础查询
    GET_INITIAL_GRAPH_CYPHER,
    GET_FILTERED_GRAPH_CYPHER,
    FILTER_GRAPH_CYPHER,
    SEARCH_GRAPH_CYPHER,
    EXPAND_NODE_CYPHER,
    GET_NODE_DETAIL_CYPHER,
    # 节点 CRUD
    CREATE_NODE_CYPHER,
    GET_NODE_BY_ID_CYPHER,
    GET_NODES_BY_PROPERTY_CYPHER,
    GET_NODES_BY_LABEL_CYPHER,
    UPDATE_NODE_CYPHER,
    DELETE_NODE_CYPHER,
    BATCH_DELETE_NODES_CYPHER,
    # 关系 CRUD
    CREATE_RELATIONSHIP_CYPHER,
    GET_RELATIONSHIP_BY_ID_CYPHER,
    GET_RELATIONSHIPS_BETWEEN_NODES_CYPHER,
    GET_NODE_RELATIONSHIPS_CYPHER,
    UPDATE_RELATIONSHIP_CYPHER,
    DELETE_RELATIONSHIP_CYPHER,
    # 高级分析
    SHORTEST_PATH_CYPHER,
    ALL_PATHS_CYPHER,
    K_HOP_NEIGHBORS_CYPHER,
    DEGREE_CENTRALITY_CYPHER,
    BETWEENNESS_CENTRALITY_CYPHER,
    PAGERANK_CYPHER,
    COMMUNITY_DETECTION_LOUVAIN_CYPHER,
    COMMUNITY_DETECTION_LPA_CYPHER,
    TRIANGLE_COUNT_CYPHER,
    CLUSTERING_COEFFICIENT_CYPHER,
    # 统计查询
    NODE_TYPE_DISTRIBUTION_CYPHER,
    RELATIONSHIP_TYPE_DISTRIBUTION_CYPHER,
    GRAPH_BASIC_STATS_CYPHER,
    NODE_DEGREE_DISTRIBUTION_CYPHER,
    CONNECTED_COMPONENTS_CYPHER,
    # 复杂查询
    TIME_RANGE_FILTER_CYPHER,
    PROPERTY_FILTER_CYPHER,
    MULTI_HOP_QUERY_CYPHER,
    COMPLEX_FILTER_QUERY_CYPHER,
    TOP_DEGREE_NODES_CYPHER,
    NODE_LABEL_USAGE_CYPHER,
    RELATIONSHIP_USAGE_CYPHER,
    UNIVERSAL_SEARCH_CYPHER,
)
from . import serializers

logger = logging.getLogger(__name__)


# ==================== 基础视图类 ====================


class BaseGraphAPIView(APIView):
    """图数据库 API 的基础视图类，提供统一的权限控制与异常处理。"""

    permission_classes = [IsAuthenticated]

    def handle_exception(self, exc):
        """统一处理 Neo4j 相关异常，返回更友好的中文提示。"""
        if isinstance(exc, ServiceUnavailable):
            logger.error(f"Neo4j 服务不可用: {exc}")
            return Response(
                {'error': 'Neo4j 数据库服务不可用，请稍后重试'},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )
        if isinstance(exc, CypherSyntaxError):
            logger.error(f"Cypher 语法错误: {exc}")
            return Response(
                {'error': 'Cypher 查询语法错误'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if isinstance(exc, Neo4jError):
            logger.error(f"Neo4j 错误: {exc}")
            return Response(
                {'error': f'Neo4j 数据库错误：{str(exc)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        logger.error(f"未知错误: {exc}")
        return super().handle_exception(exc)


# ==================== 节点 CRUD 视图 ====================


class NodeCRUDView(BaseGraphAPIView):
    """节点的增删改查接口视图，封装常用的 Neo4j 操作。"""

    def post(self, request):
        """
        创建新节点。

        请求体示例：
        {
            "label": "User",
            "properties": {
                "name": "张三",
                "age": 30,
                "email": "zhangsan@example.com"
            }
        }
        """
        try:
            label = request.data.get('label')
            properties = request.data.get('properties', {})

            if not label:
                return Response(
                    {'error': 'Label is required'},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # 拼接 Cypher 语句并写入节点属性
            cypher_query = f"CREATE (n:{label} $properties) RETURN n"
            results, summary = write_to_neo4j(cypher_query, {'properties': properties})

            logger.info(f"用户 {request.user.id} 创建节点成功: {summary}")
            return Response(
                {
                    'message': 'Node created successfully',
                    'data': results,
                    'summary': summary,
                },
                status=status.HTTP_201_CREATED,
            )
        except Exception as exc:  # noqa: BLE001
            logger.error(f"创建节点失败: {exc}")
            return Response(
                {'error': 'Failed to create node', 'details': str(exc)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def get(self, request):
        """
        获取节点信息。

        查询参数：
        - node_id: 节点 ID
        - label: 节点标签
        - property: 属性名
        - value: 属性值
        - limit: 返回数量限制
        """
        try:
            node_id = request.query_params.get('node_id')
            label = request.query_params.get('label')
            property_name = request.query_params.get('property')
            property_value = request.query_params.get('value')
            limit = int(request.query_params.get('limit', 50))

            if node_id:
                # 按 ID 获取节点
                results = read_from_neo4j(GET_NODE_BY_ID_CYPHER, {'node_id': node_id})
            elif label and property_name and property_value:
                # 按属性获取节点
                cypher_query = f"MATCH (n:{label}) WHERE n.{property_name} = $value RETURN n LIMIT $limit"
                results = read_from_neo4j(
                    cypher_query,
                    {
                        'value': property_value,
                        'limit': limit,
                    },
                )
            elif label:
                # 按标签获取节点
                cypher_query = f"MATCH (n:{label}) RETURN n LIMIT $limit"
                results = read_from_neo4j(cypher_query, {'limit': limit})
            else:
                return Response(
                    {'error': 'node_id or label is required'},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            logger.info(f"用户 {request.user.id} 获取节点信息成功")
            return Response(
                {
                    'message': 'Nodes retrieved successfully',
                    'data': results,
                    'count': len(results),
                },
                status=status.HTTP_200_OK,
            )
        except Exception as exc:  # noqa: BLE001
            logger.error(f"获取节点信息失败: {exc}")
            return Response(
                {'error': 'Failed to retrieve nodes', 'details': str(exc)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def put(self, request):
        """
        更新节点属性。

        请求体示例：
        {
            "node_id": "node_element_id",
            "properties": {
                "name": "李四",
                "age": 25
            }
        }
        """
        try:
            node_id = request.data.get('node_id')
            properties = request.data.get('properties', {})

            if not node_id:
                return Response(
                    {'error': 'node_id is required'},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if not validate_node_exists(node_id):
                return Response(
                    {'error': 'Node not found'},
                    status=status.HTTP_404_NOT_FOUND,
                )

            results, summary = write_to_neo4j(
                UPDATE_NODE_CYPHER,
                {
                    'node_id': node_id,
                    'properties': properties,
                },
            )

            logger.info(f"用户 {request.user.id} 更新节点成功: {summary}")
            return Response(
                {
                    'message': 'Node updated successfully',
                    'data': results,
                    'summary': summary,
                },
                status=status.HTTP_200_OK,
            )
        except Exception as exc:  # noqa: BLE001
            logger.error(f"更新节点失败: {exc}")
            return Response(
                {'error': 'Failed to update node', 'details': str(exc)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def delete(self, request):
        """
        删除节点，可处理单个或批量删除。

        请求体示例：
        {
            "node_id": "node_element_id"
        }
        或
        {
            "node_ids": ["id1", "id2", "id3"]
        }
        """
        try:
            node_id = request.data.get('node_id')
            node_ids = request.data.get('node_ids')

            if node_id:
                # 删除单个节点
                if not validate_node_exists(node_id):
                    return Response(
                        {'error': 'Node not found'},
                        status=status.HTTP_404_NOT_FOUND,
                    )

                results, summary = write_to_neo4j(DELETE_NODE_CYPHER, {'node_id': node_id})
                message = 'Node deleted successfully'
            elif node_ids and isinstance(node_ids, list):
                # 批量删除节点
                results, summary = write_to_neo4j(
                    BATCH_DELETE_NODES_CYPHER,
                    {'node_ids': node_ids},
                )
                message = f'{len(node_ids)} nodes deleted successfully'
            else:
                return Response(
                    {'error': 'node_id or node_ids is required'},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            logger.info(f"用户 {request.user.id} 删除节点成功: {summary}")
            return Response(
                {
                    'message': message,
                    'summary': summary,
                },
                status=status.HTTP_200_OK,
            )
        except Exception as exc:  # noqa: BLE001
            logger.error(f"删除节点失败: {exc}")
            return Response(
                {'error': 'Failed to delete node', 'details': str(exc)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

class RelationshipCRUDView(BaseGraphAPIView):
    """关系的增删改查视图，负责维护节点之间的连线。"""

    def post(self, request):
        """
        创建新的关系。

        请求体示例：
        {
            "from_node_id": "source_node_id",
            "to_node_id": "target_node_id",
            "relationship_type": "KNOWS",
            "properties": {
                "since": "2023-01-01",
                "weight": 0.8
            }
        }
        """
        try:
            from_node_id = request.data.get('from_node_id')
            to_node_id = request.data.get('to_node_id')
            relationship_type = request.data.get('relationship_type')
            properties = request.data.get('properties', {})

            if not all([from_node_id, to_node_id, relationship_type]):
                return Response(
                    {'error': 'from_node_id, to_node_id, and relationship_type are required'},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # 校验起点和终点是否存在
            if not validate_node_exists(from_node_id):
                return Response(
                    {'error': 'Source node not found'},
                    status=status.HTTP_404_NOT_FOUND,
                )

            if not validate_node_exists(to_node_id):
                return Response(
                    {'error': 'Target node not found'},
                    status=status.HTTP_404_NOT_FOUND,
                )

            # 生成创建关系的 Cypher 语句
            cypher_query = f"""
            MATCH (a), (b)
            WHERE elementId(a) = $from_node_id AND elementId(b) = $to_node_id
            CREATE (a)-[r:{relationship_type} $properties]->(b)
            RETURN r
            """

            results, summary = write_to_neo4j(
                cypher_query,
                {
                    'from_node_id': from_node_id,
                    'to_node_id': to_node_id,
                    'properties': properties,
                },
            )

            logger.info(f"用户 {request.user.id} 创建关系成功: {summary}")
            return Response(
                {
                    'message': 'Relationship created successfully',
                    'data': results,
                    'summary': summary,
                },
                status=status.HTTP_201_CREATED,
            )
        except Exception as exc:  # noqa: BLE001
            logger.error(f"创建关系失败: {exc}")
            return Response(
                {'error': 'Failed to create relationship', 'details': str(exc)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def get(self, request):
        """
        获取关系信息。

        查询参数：
        - relationship_id: 关系 ID
        - from_node_id: 起始节点 ID
        - to_node_id: 目标节点 ID
        - relationship_type: 关系类型
        - limit: 返回数量限制
        """
        try:
            relationship_id = request.query_params.get('relationship_id')
            from_node_id = request.query_params.get('from_node_id')
            to_node_id = request.query_params.get('to_node_id')
            relationship_type = request.query_params.get('relationship_type')
            limit = int(request.query_params.get('limit', 50))

            if relationship_id:
                # 按 ID 获取关系
                results = read_from_neo4j(
                    GET_RELATIONSHIP_BY_ID_CYPHER,
                    {'relationship_id': relationship_id},
                )
            elif from_node_id and to_node_id:
                # 按两个节点获取关系
                results = read_from_neo4j(
                    GET_RELATIONSHIPS_BETWEEN_NODES_CYPHER,
                    {
                        'from_node_id': from_node_id,
                        'to_node_id': to_node_id,
                        'limit': limit,
                    },
                )
            elif relationship_type:
                # 按类型获取关系
                cypher_query = f"MATCH ()-[r:{relationship_type}]-() RETURN r LIMIT $limit"
                results = read_from_neo4j(cypher_query, {'limit': limit})
            else:
                return Response(
                    {'error': 'relationship_id, node_ids, or relationship_type is required'},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            logger.info(f"用户 {request.user.id} 获取关系信息成功")
            return Response(
                {
                    'message': 'Relationships retrieved successfully',
                    'data': results,
                    'count': len(results),
                },
                status=status.HTTP_200_OK,
            )
        except Exception as exc:  # noqa: BLE001
            logger.error(f"获取关系信息失败: {exc}")
            return Response(
                {'error': 'Failed to retrieve relationships', 'details': str(exc)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def put(self, request):
        """
        更新关系属性。

        请求体示例：
        {
            "relationship_id": "relationship_element_id",
            "properties": {
                "weight": 0.9,
                "updated_at": "2024-01-01"
            }
        }
        """
        try:
            relationship_id = request.data.get('relationship_id')
            properties = request.data.get('properties', {})

            if not relationship_id:
                return Response(
                    {'error': 'relationship_id is required'},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if not validate_relationship_exists(relationship_id):
                return Response(
                    {'error': 'Relationship not found'},
                    status=status.HTTP_404_NOT_FOUND,
                )

            results, summary = write_to_neo4j(
                UPDATE_RELATIONSHIP_CYPHER,
                {
                    'relationship_id': relationship_id,
                    'properties': properties,
                },
            )

            logger.info(f"用户 {request.user.id} 更新关系成功: {summary}")
            return Response(
                {
                    'message': 'Relationship updated successfully',
                    'data': results,
                    'summary': summary,
                },
                status=status.HTTP_200_OK,
            )
        except Exception as exc:  # noqa: BLE001
            logger.error(f"更新关系失败: {exc}")
            return Response(
                {'error': 'Failed to update relationship', 'details': str(exc)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def delete(self, request):
        """
        删除关系。

        请求体示例：
        {
            "relationship_id": "relationship_element_id"
        }
        """
        try:
            relationship_id = request.data.get('relationship_id')

            if not relationship_id:
                return Response(
                    {'error': 'relationship_id is required'},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if not validate_relationship_exists(relationship_id):
                return Response(
                    {'error': 'Relationship not found'},
                    status=status.HTTP_404_NOT_FOUND,
                )

            results, summary = write_to_neo4j(
                DELETE_RELATIONSHIP_CYPHER,
                {'relationship_id': relationship_id},
            )

            logger.info(f"用户 {request.user.id} 删除关系成功: {summary}")
            return Response(
                {
                    'message': 'Relationship deleted successfully',
                    'summary': summary,
                },
                status=status.HTTP_200_OK,
            )
        except Exception as exc:  # noqa: BLE001
            logger.error(f"删除关系失败: {exc}")
            return Response(
                {'error': 'Failed to delete relationship', 'details': str(exc)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class GraphAnalysisView(BaseGraphAPIView):
    """执行图谱高级分析（最短路径、K 跳邻居、中心性等）。"""

    SUPPORTED_ANALYSES = {'shortest_path', 'k_hop_neighbors', 'centrality'}

    def post(self, request):
        analysis_type = request.data.get('analysis_type')
        parameters = request.data.get('parameters', {})

        if not analysis_type:
            return Response({'error': 'analysis_type is required'}, status=status.HTTP_400_BAD_REQUEST)

        if analysis_type not in self.SUPPORTED_ANALYSES:
            return Response({'error': f"Unsupported analysis_type '{analysis_type}'"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            if analysis_type == 'shortest_path':
                return self._handle_shortest_path(request, parameters)
            if analysis_type == 'k_hop_neighbors':
                return self._handle_k_hop(request, parameters)
            if analysis_type == 'centrality':
                return self._handle_centrality(request, parameters)

            return Response({'error': 'Analysis handler missing'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as exc:
            logger.error(f"Graph analysis '{analysis_type}' failed: {exc}")
            return Response(
                {'error': 'Failed to perform graph analysis', 'details': str(exc)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def _handle_shortest_path(self, request, params):
        """基于最短路径算法，返回两节点之间的最短连线路径。"""
        source = params.get('source_node') or params.get('from_node_id')
        target = params.get('target_node') or params.get('to_node_id')
        max_depth = params.get('max_depth') or params.get('max_length') or 8

        if not source or not target:
            return Response({'error': 'source_node and target_node are required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            max_depth = max(1, min(int(max_depth), 12))
        except (TypeError, ValueError):
            max_depth = 8

        cypher_params = {'source_id': str(source), 'target_id': str(target), 'max_depth': max_depth}
        logger.info(f"User {request.user.id} shortest path analysis: {cypher_params}")

        results = read_from_neo4j(SHORTEST_PATH_CYPHER, cypher_params)
        serializer = serializers.GraphDataSerializer(instance=results)
        graph_payload = serializer.data

        payload = {
            'analysis_type': 'shortest_path',
            'graph': graph_payload,
            'meta': {
                'source': source,
                'target': target,
                'max_depth': max_depth,
                'steps_found': graph_payload.get('counts', {}).get('links', len(graph_payload.get('links', [])))
            }
        }
        return Response(payload, status=status.HTTP_200_OK)

    def _handle_k_hop(self, request, params):
        """查询指定节点在 K 跳以内的邻居节点集合。"""
        node_id = params.get('node_id') or params.get('source_node')
        hops = params.get('hops') or params.get('k') or 2
        limit = params.get('limit', 100)

        if not node_id:
            return Response({'error': 'node_id is required for k-hop analysis'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            hops = max(1, min(int(hops), 5))
        except (TypeError, ValueError):
            hops = 2
        try:
            limit = max(1, min(int(limit), 300))
        except (TypeError, ValueError):
            limit = 100

        cypher_params = {'node_id': str(node_id), 'hops': hops, 'limit': limit}
        logger.info(f"User {request.user.id} k-hop analysis params={cypher_params}")

        results = read_from_neo4j(K_HOP_NEIGHBORS_CYPHER, cypher_params)
        serializer = serializers.GraphDataSerializer(instance=results)
        graph_payload = serializer.data

        payload = {
            'analysis_type': 'k_hop_neighbors',
            'graph': graph_payload,
            'meta': {
                'node_id': node_id,
                'hops': hops,
                'limit': limit,
                'returned_nodes': graph_payload.get('counts', {}).get('nodes', len(graph_payload.get('nodes', [])))
            }
        }
        return Response(payload, status=status.HTTP_200_OK)

    def _handle_centrality(self, request, params):
        """计算节点的度中心性，并返回度值最高的节点列表。"""
        limit = params.get('limit', 20)
        try:
            limit = max(1, min(int(limit), 100))
        except (TypeError, ValueError):
            limit = 20

        logger.info(f"User {request.user.id} degree centrality analysis limit={limit}")
        results = read_from_neo4j(DEGREE_CENTRALITY_CYPHER, {'limit': limit})

        metrics = []
        for record in results:
            node_dict = record.get('n') or record.get('node')
            if not isinstance(node_dict, dict):
                continue
            node_id = serializers.get_node_id(node_dict)
            metrics.append({
                'id': node_id,
                'name': node_dict.get('name', node_id),
                'degree': record.get('degree', 0),
                'labels': node_dict.get('labels', [])
            })

        payload = {
            'analysis_type': 'centrality',
            'metrics': {
                'degree': metrics
            },
            'meta': {
                'limit': limit
            }
        }
        return Response(payload, status=status.HTTP_200_OK)

class GraphStatisticsView(BaseGraphAPIView):
    """返回知识图谱的整体统计信息（节点、关系、连通性等）。"""

    def get(self, request):
        stat_type = request.query_params.get('stat_type', 'basic_stats')

        handlers = {
            'node_distribution': NODE_TYPE_DISTRIBUTION_CYPHER,
            'relationship_distribution': RELATIONSHIP_TYPE_DISTRIBUTION_CYPHER,
            'basic_stats': GRAPH_BASIC_STATS_CYPHER,
            'degree_distribution': NODE_DEGREE_DISTRIBUTION_CYPHER,
            'components': CONNECTED_COMPONENTS_CYPHER,
        }

        if stat_type not in handlers:
            return Response(
                {'error': 'Invalid stat_type. Use: node_distribution, relationship_distribution, basic_stats, degree_distribution, components'},
                status=status.HTTP_400_BAD_REQUEST
            )

        results = read_from_neo4j(handlers[stat_type], {})

        return Response({
            'stat_type': stat_type,
            'results': results,
            'count': len(results)
        }, status=status.HTTP_200_OK)

class ComplexQueryView(BaseGraphAPIView):
    """提供复杂条件组合查询的简化接口，支持时间、属性与多跳过滤。"""

    def post(self, request):
        query_type = request.data.get('query_type', 'composite')
        parameters = request.data.get('parameters', {})

        limit = parameters.get('limit', 100)
        try:
            limit = max(1, min(int(limit), 500))
        except (TypeError, ValueError):
            limit = 100

        if query_type in ('composite', 'filter', 'basic'):
            return self._handle_composite(parameters, limit)
        if query_type == 'time_range':
            return self._handle_time_range(parameters, limit)
        if query_type == 'multi_hop':
            return self._handle_multi_hop(parameters, limit)

        return Response({'error': f"Unsupported query_type '{query_type}'"}, status=status.HTTP_400_BAD_REQUEST)

    def _handle_composite(self, params, limit):
        """根据标签、关系类型与关键词组合过滤图谱。"""
        node_labels = params.get('node_labels') or params.get('node_types')
        relationship_types = params.get('relationship_types')
        search = params.get('search') or params.get('keyword')

        cypher_params = {
            'node_labels': node_labels or None,
            'relationship_types': relationship_types or None,
            'search': search,
            'limit': limit
        }

        results = read_from_neo4j(FILTER_GRAPH_CYPHER, cypher_params)
        serializer = serializers.GraphDataSerializer(instance=results)

        return Response({
            'graph': serializer.data,
            'meta': {
                'query_type': 'composite',
                'limit': limit,
                'filters': {
                    'node_labels': node_labels,
                    'relationship_types': relationship_types,
                    'search': search
                }
            }
        }, status=status.HTTP_200_OK)

    def _handle_time_range(self, params, limit):
        """按照时间区间过滤事件或关系，用于回放特定时期的数据。"""
        start_time = params.get('start_time') or params.get('start')
        end_time = params.get('end_time') or params.get('end')
        if not start_time or not end_time:
            return Response({'error': 'start_time and end_time are required'}, status=status.HTTP_400_BAD_REQUEST)

        cypher_params = {
            'start_time': start_time,
            'end_time': end_time,
            'limit': limit
        }
        results = read_from_neo4j(TIME_RANGE_FILTER_CYPHER, cypher_params)
        serializer = serializers.GraphDataSerializer(instance=results)

        return Response({
            'graph': serializer.data,
            'meta': {
                'query_type': 'time_range',
                'limit': limit,
                'start_time': start_time,
                'end_time': end_time
            }
        }, status=status.HTTP_200_OK)

    def _handle_multi_hop(self, params, limit):
        """以某个节点为起点执行多跳扩散，获取更大的关联子图。"""
        node_id = params.get('node_id') or params.get('source_node')
        hops = params.get('hops') or params.get('max_hops') or 2
        try:
            hops = max(1, min(int(hops), 5))
        except (TypeError, ValueError):
            hops = 2

        if not node_id:
            return Response({'error': 'node_id is required for multi_hop query'}, status=status.HTTP_400_BAD_REQUEST)

        cypher_params = {
            'node_id': str(node_id),
            'hops': hops,
            'limit': limit
        }
        results = read_from_neo4j(K_HOP_NEIGHBORS_CYPHER, cypher_params)
        serializer = serializers.GraphDataSerializer(instance=results)

        return Response({
            'graph': serializer.data,
            'meta': {
                'query_type': 'multi_hop',
                'node_id': node_id,
                'hops': hops,
                'limit': limit
            }
        }, status=status.HTTP_200_OK)

class InitialGraphView(BaseGraphAPIView):
    """获取初始图谱快照，用于前端首次渲染可视化。"""

    def get(self, request, format=None):
        """处理初始图谱快照请求，可通过 limit 参数控制返回规模。"""
        try:
            raw_limit = request.query_params.get('limit', 50)
            try:
                limit = max(1, min(int(raw_limit), 200))
            except (TypeError, ValueError):
                limit = 50

            logger.info(f"User {request.user.id} requests initial graph snapshot with limit={limit}")
            results = read_from_neo4j(GET_INITIAL_GRAPH_CYPHER, {'limit': limit})

            serializer = serializers.GraphDataSerializer(instance=results)
            graph_payload = serializer.data

            response_payload = {
                'graph': graph_payload,
                'meta': {
                    'limit': limit,
                    'returned_nodes': graph_payload.get('counts', {}).get('nodes', len(graph_payload.get('nodes', []))),
                    'returned_links': graph_payload.get('counts', {}).get('links', len(graph_payload.get('links', [])))
                }
            }

            logger.info(f"User {request.user.id} retrieved initial graph successfully")
            return Response(response_payload, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"User {request.user.id} failed to load initial graph: {e}")
            return Response(
                {'error': 'Failed to load graph data', 'details': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class FilteredGraphView(BaseGraphAPIView):
    """根据筛选条件返回子图，支持 GET 参数与 POST JSON 双模式。"""

    SUPPORTED_QUERY_KEYS = {
        'node_types',
        'relationship_types',
        'search',
        'keyword',
        'limit'
    }

    def get(self, request, format=None):
        return self._handle_request(request, request.query_params)

    def post(self, request, format=None):
        return self._handle_request(request, request.data)

    def _handle_request(self, request, payload):
        try:
            raw_limit = payload.get('limit', 100)
            try:
                limit = max(1, min(int(raw_limit), 300))
            except (TypeError, ValueError):
                limit = 100

            node_types = self._normalise_list(payload.get('node_types'))
            relationship_types = self._normalise_list(payload.get('relationship_types'))
            search_term = payload.get('search') or payload.get('keyword') or ''

            logger.info(
                f"User {request.user.id} filters graph: node_types={node_types}, relationship_types={relationship_types}, search={search_term}, limit={limit}"
            )

            cypher_params = {
                'node_labels': node_types or None,
                'relationship_types': relationship_types or None,
                'search': search_term.strip() or None,
                'limit': limit
            }

            results = read_from_neo4j(FILTER_GRAPH_CYPHER, cypher_params)
            serializer = serializers.GraphDataSerializer(instance=results)
            graph_payload = serializer.data

            response_payload = {
                'graph': graph_payload,
                'meta': {
                    'limit': limit,
                    'filters': {
                        'node_types': node_types,
                        'relationship_types': relationship_types,
                        'search': search_term.strip() or None
                    },
                    'returned_nodes': graph_payload.get('counts', {}).get('nodes', len(graph_payload.get('nodes', []))),
                    'returned_links': graph_payload.get('counts', {}).get('links', len(graph_payload.get('links', [])))
                }
            }

            return Response(response_payload, status=status.HTTP_200_OK)

        except Exception as exc:
            logger.error(f"Graph filtering failed: {exc}")
            return Response(
                {'error': 'Failed to filter graph', 'details': str(exc)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @staticmethod
    def _normalise_list(value):
        if value is None or value == '':
            return []
        if isinstance(value, (list, tuple, set)):
            return [str(item).strip() for item in value if str(item).strip()]
        if isinstance(value, str):
            return [item.strip() for item in value.split(',') if item.strip()]
        return [str(value).strip()]

class GraphMetadataView(BaseGraphAPIView):
    """提供图谱结构洞察，如高连接度节点、标签与关系使用频次。"""

    def get(self, request, format=None):
        node_limit = self._clamp(request.query_params.get('node_limit', 10), default=10, min_value=1, max_value=100)
        node_skip = self._clamp(request.query_params.get('node_skip', 0), default=0, min_value=0, max_value=10_000)
        rel_limit = self._clamp(request.query_params.get('relationship_limit', 25), default=25, min_value=1, max_value=200)
        label_limit = self._clamp(request.query_params.get('label_limit', 25), default=25, min_value=1, max_value=200)

        try:
            top_nodes_raw = read_from_neo4j(
                TOP_DEGREE_NODES_CYPHER,
                {'limit': node_limit + 1, 'skip': node_skip}
            )
            labels_raw = read_from_neo4j(
                NODE_LABEL_USAGE_CYPHER,
                {'limit': label_limit}
            )
            relationships_raw = read_from_neo4j(
                RELATIONSHIP_USAGE_CYPHER,
                {'limit': rel_limit}
            )

            nodes_formatted = []
            for record in top_nodes_raw[:node_limit]:
                node_obj = record.get('n')
                degree = record.get('degree', 0)
                if node_obj is None:
                    continue
                properties = dict(node_obj)
                labels = list(getattr(node_obj, 'labels', []))
                node_id = serializers.get_node_id(properties) or properties.get('node_id') or properties.get('id')
                element_id = getattr(node_obj, 'element_id', None)
                display_name = (
                    properties.get('name')
                    or properties.get('title')
                    or properties.get('term')
                    or node_id
                    or element_id
                    or labels[0] if labels else None
                )
                nodes_formatted.append({
                    'id': node_id or element_id,
                    'elementId': element_id,
                    'labels': labels,
                    'name': display_name,
                    'degree': degree,
                    'properties': properties
                })

            has_more_nodes = len(top_nodes_raw) > node_limit

            labels_formatted = [
                {'label': record.get('label'), 'count': record.get('count', 0)}
                for record in labels_raw
            ]

            relationships_formatted = [
                {'type': record.get('type'), 'count': record.get('count', 0)}
                for record in relationships_raw
            ]

            response_payload = {
                'nodes': {
                    'items': nodes_formatted,
                    'pagination': {
                        'skip': node_skip,
                        'limit': node_limit,
                        'hasMore': has_more_nodes
                    }
                },
                'labels': labels_formatted,
                'relationships': relationships_formatted
            }

            return Response(response_payload, status=status.HTTP_200_OK)
        except Exception as exc:
            logger.error(f"Failed to load graph metadata: {exc}")
            return Response(
                {'error': 'Failed to load graph metadata', 'details': str(exc)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @staticmethod
    def _clamp(value, default, min_value, max_value):
        try:
            numeric = int(value)
        except (TypeError, ValueError):
            numeric = default
        return max(min_value, min(max_value, numeric))

class NodeDetailView(BaseGraphAPIView):
    """获取单个节点及其邻居详情，供前端弹窗或信息面板使用。"""

    def get(self, request, node_id, format=None):
        if not node_id:
            logger.warning(f"User {request.user.id} requested node details without providing an ID")
            return Response({'error': 'Node ID is required'}, status=status.HTTP_400_BAD_REQUEST)

        limit_param = request.query_params.get('limit')
        try:
            limit = max(1, min(int(limit_param), 200)) if limit_param is not None else None
        except (TypeError, ValueError):
            limit = None

        logger.info(f"User {request.user.id} requesting node detail for: {node_id}")
        params = {'node_id': node_id}
        if limit is not None:
            params['limit'] = limit

        try:
            results = read_from_neo4j(GET_NODE_DETAIL_CYPHER, params)

            if not results:
                return Response({'error': 'Node not found'}, status=status.HTTP_404_NOT_FOUND)

            detail_serializer = serializers.NodeDetailSerializer(instance=results)
            graph_serializer = serializers.GraphDataSerializer(instance=results)

            response_payload = {
                'node': detail_serializer.data.get('node_properties', {}),
                'neighbors': detail_serializer.data.get('neighbors', []),
                'graph': graph_serializer.data
            }

            return Response(response_payload, status=status.HTTP_200_OK)
        except Exception as exc:
            logger.error(f"Failed to load node detail for {node_id}: {exc}")
            return Response(
                {'error': 'Failed to load node detail', 'details': str(exc)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class GraphUniversalSearchView(BaseGraphAPIView):
    """提供全局模糊搜索，返回结构化的节点与关系匹配结果。"""

    def get(self, request, format=None):
        query = (request.query_params.get('query') or '').strip()
        if not query:
            return Response({'error': 'Query parameter is required'}, status=status.HTTP_400_BAD_REQUEST)

        node_limit = self._clamp(request.query_params.get('node_limit', 25), default=25, min_value=1, max_value=200)
        relationship_limit = self._clamp(request.query_params.get('relationship_limit', 25), default=25, min_value=1, max_value=200)

        try:
            results = read_from_neo4j(
                UNIVERSAL_SEARCH_CYPHER,
                {
                    'query': query,
                    'node_limit': node_limit,
                    'relationship_limit': relationship_limit
                }
            )

            nodes = []
            relationships = []

            for record in results:
                kind = record.get('kind')
                if kind == 'node':
                    properties = record.get('properties') or {}
                    labels = record.get('labels') or []
                    node_id = serializers.get_node_id(properties) or properties.get('node_id') or record.get('id')
                    display_name = (
                        properties.get('name')
                        or properties.get('title')
                        or properties.get('term')
                        or node_id
                    )
                    nodes.append({
                        'id': node_id or record.get('id'),
                        'elementId': record.get('id'),
                        'labels': labels,
                        'name': display_name,
                        'degree': record.get('degree', 0),
                        'properties': properties
                    })
                else:
                    relationships.append({
                        'id': record.get('id'),
                        'type': record.get('type'),
                        'source': record.get('source'),
                        'target': record.get('target'),
                        'properties': record.get('properties') or {}
                    })

            response_payload = {
                'query': query,
                'nodes': nodes,
                'relationships': relationships,
                'meta': {
                    'node_limit': node_limit,
                    'relationship_limit': relationship_limit,
                    'returned_nodes': len(nodes),
                    'returned_relationships': len(relationships)
                }
            }
            return Response(response_payload, status=status.HTTP_200_OK)
        except Exception as exc:
            logger.error(f"Universal search failed: {exc}")
            return Response(
                {'error': 'Failed to complete search', 'details': str(exc)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @staticmethod
    def _clamp(value, default, min_value, max_value):
        try:
            numeric = int(value)
        except (TypeError, ValueError):
            numeric = default
        return max(min_value, min(max_value, numeric))

class GraphSearchView(BaseGraphAPIView):
    """轻量级模糊搜索接口，聚焦返回匹配的节点列表。"""

    SCOPE_LABEL_MAP = {
        'cases': ['Case', 'FraudCase'],
        'people': ['Person', 'User'],
        'organizations': ['Organization'],
        'devices': ['Device'],
    }

    def get(self, request, format=None):
        query = (request.query_params.get('query') or '').strip()
        if not query:
            return Response({'error': 'Query parameter is required'}, status=status.HTTP_400_BAD_REQUEST)

        raw_limit = request.query_params.get('limit', 50)
        try:
            limit = max(1, min(int(raw_limit), 200))
        except (TypeError, ValueError):
            limit = 50

        scope_values = request.query_params.getlist('scope') or [request.query_params.get('scope')]
        labels_filter = self._labels_from_scope(scope_values)

        params = {
            'query': query,
            'limit': limit,
            'labels': labels_filter
        }

        logger.info(f"User {request.user.id} searching graph query='{query}' limit={limit} labels={labels_filter}")

        try:
            results = read_from_neo4j(SEARCH_GRAPH_CYPHER, params)
            serializer = serializers.GraphDataSerializer(instance=results)
            graph_payload = serializer.data

            response_payload = {
                'graph': graph_payload,
                'meta': {
                    'query': query,
                    'limit': limit,
                    'labels': labels_filter
                }
            }
            return Response(response_payload, status=status.HTTP_200_OK)
        except Exception as exc:
            logger.error(f"Graph search failed: {exc}")
            return Response(
                {'error': 'Failed to search graph', 'details': str(exc)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @classmethod
    def _labels_from_scope(cls, scopes):
        labels = []
        for scope in scopes:
            if not scope:
                continue
            scope_key = str(scope).lower()
            if scope_key in cls.SCOPE_LABEL_MAP:
                labels.extend(cls.SCOPE_LABEL_MAP[scope_key])
        # Keep list unique while preserving order
        return list(dict.fromkeys(labels)) or None

class NodeExpandView(BaseGraphAPIView):
    """按需扩展节点，返回一度邻居以便做可视化探索。"""

    def get(self, request, node_id, format=None):
        if not node_id:
            return Response({'error': 'Node ID is required'}, status=status.HTTP_400_BAD_REQUEST)

        raw_limit = request.query_params.get('limit', 50)
        try:
            limit = max(1, min(int(raw_limit), 200))
        except (TypeError, ValueError):
            limit = 50

        logger.info(f"User {request.user.id} expands node {node_id} with limit={limit}")
        try:
            results = read_from_neo4j(EXPAND_NODE_CYPHER, {'node_id': node_id, 'limit': limit})
            serializer = serializers.GraphDataSerializer(instance=results)
            graph_payload = serializer.data

            response_payload = {
                'graph': graph_payload,
                'meta': {
                    'node_id': node_id,
                    'limit': limit,
                    'returned_nodes': graph_payload.get('counts', {}).get('nodes', len(graph_payload.get('nodes', [])))
                }
            }
            return Response(response_payload, status=status.HTTP_200_OK)
        except Exception as exc:
            logger.error(f"Failed to expand node {node_id}: {exc}")
            return Response(
                {'error': 'Failed to expand node', 'details': str(exc)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
