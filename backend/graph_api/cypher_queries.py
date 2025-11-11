# backend/graph_api/cypher_queries.py

# Cypher 查询语句常量

# ==================== 基础图数据查询 ====================

# 获取初始图谱数据，用于首次加载可视化
# 注意：LIMIT 50 仅为示例，应根据实际数据量和前端性能调整
# 返回节点 n, m 以及它们之间的关系 r
GET_INITIAL_GRAPH_CYPHER = """
MATCH (n)-[r]-(m)
RETURN n, r, m
LIMIT $limit
"""

# ==================== 节点 CRUD 操作 ====================

# 创建节点
CREATE_NODE_CYPHER = """
CREATE (n:$label $properties)
RETURN n
"""

# 根据ID获取节点
GET_NODE_BY_ID_CYPHER = """
MATCH (n)
WHERE elementId(n) = $node_id
RETURN n
"""

# 根据属性获取节点
GET_NODES_BY_PROPERTY_CYPHER = """
MATCH (n:$label)
WHERE n.$property = $value
RETURN n
LIMIT $limit
"""

# 获取所有指定标签的节点
GET_NODES_BY_LABEL_CYPHER = """
MATCH (n:$label)
RETURN n
LIMIT $limit
"""

# 更新节点属性
UPDATE_NODE_CYPHER = """
MATCH (n)
WHERE elementId(n) = $node_id
SET n += $properties
RETURN n
"""

# 删除节点（包括所有关系）
DELETE_NODE_CYPHER = """
MATCH (n)
WHERE elementId(n) = $node_id
DETACH DELETE n
"""

# 批量删除节点
BATCH_DELETE_NODES_CYPHER = """
MATCH (n)
WHERE elementId(n) IN $node_ids
DETACH DELETE n
"""

# ==================== 关系 CRUD 操作 ====================

# 创建关系
CREATE_RELATIONSHIP_CYPHER = """
MATCH (a), (b)
WHERE elementId(a) = $from_node_id AND elementId(b) = $to_node_id
CREATE (a)-[r:$relationship_type $properties]->(b)
RETURN r
"""

# 根据ID获取关系
GET_RELATIONSHIP_BY_ID_CYPHER = """
MATCH ()-[r]-()
WHERE elementId(r) = $relationship_id
RETURN r
"""

# 获取两个节点之间的关系
GET_RELATIONSHIPS_BETWEEN_NODES_CYPHER = """
MATCH (a)-[r]-(b)
WHERE elementId(a) = $node1_id AND elementId(b) = $node2_id
RETURN r
"""

# 获取节点的所有关系
GET_NODE_RELATIONSHIPS_CYPHER = """
MATCH (n)-[r]-()
WHERE elementId(n) = $node_id
RETURN r
LIMIT $limit
"""

# 更新关系属性
UPDATE_RELATIONSHIP_CYPHER = """
MATCH ()-[r]-()
WHERE elementId(r) = $relationship_id
SET r += $properties
RETURN r
"""

# 删除关系
DELETE_RELATIONSHIP_CYPHER = """
MATCH ()-[r]-()
WHERE elementId(r) = $relationship_id
DELETE r
"""

# 根据属性值过滤图谱数据
# 警告：这是一个非常基础的过滤示例，仅匹配具有特定属性值的节点及其一度邻居。
# 对于实际的反欺诈应用，需要更复杂的查询，可能涉及：
# - 匹配特定的节点标签 (例如 :User, :Transaction, :Device)
# - 匹配特定的关系类型 (例如 :PERFORMED_TRANSACTION, :USED_DEVICE)
# - 匹配更长的路径模式 (例如多跳关联)
# - 使用图算法（如社区检测、路径查找）识别可疑模式 [30, 31, 32, 33, 34]
# - 结合多个过滤条件
# 这个查询的灵活性和性能可能不足以满足生产需求，需要根据具体场景进行深度优化。
GET_FILTERED_GRAPH_CYPHER = """
MATCH (n {prop: $value})-[r]-(m) // $value 将作为参数传入
RETURN n, r, m
LIMIT $limit // 同样需要调整 LIMIT
"""

# 获取特定节点的详细信息及其直接邻居
# 使用 elementId() 获取 Neo4j 内部 ID 进行精确匹配可能更可靠，
# 但这里使用一个假设的唯一属性 'node_id' 作为示例。
# 如果使用内部 ID，查询应类似 MATCH (n) WHERE elementId(n) = $node_element_id...
GET_NODE_DETAIL_CYPHER = """
MATCH (n {name: $node_id})-[r]-(m) // $node_id 将作为参数传入
RETURN n, r, m
"""
# MATCH (n) WHERE elementId(n) = $node_id
# MATCH (n)-[r]-(m)
# RETURN n, r, m
# --- 其他可能的查询示例 (供参考) ---

# 查询特定用户及其执行的交易
GET_USER_TRANSACTIONS_CYPHER = """
MATCH (u:User {user_id: $user_id})-->(t:Transaction)
RETURN u, t
LIMIT 100
"""

# 查询共享同一设备或 IP 地址的用户（潜在欺诈信号）
GET_SHARED_IDENTIFIER_USERS_CYPHER = """
MATCH (u1:User)-[:USED_DEVICE|:USED_IP]->(d)<-[:USED_DEVICE|:USED_IP]-(u2:User)
WHERE u1 <> u2
RETURN u1, u2, d
LIMIT 100
"""

# ==================== 高级图分析功能 ====================

# 最短路径查询
SHORTEST_PATH_CYPHER = """
MATCH (start), (end)
WHERE (elementId(start) = $source_id OR toString(start.name) = $source_id)
  AND (elementId(end) = $target_id OR toString(end.name) = $target_id)
WITH start, end
MATCH path = shortestPath((start)-[*..$max_depth]-(end))
WITH path
UNWIND range(0, size(relationships(path)) - 1) AS idx
WITH
  nodes(path)[idx] AS n,
  relationships(path)[idx] AS r,
  nodes(path)[idx + 1] AS m
RETURN n, r, m
"""

# 所有路径查询（限制深度）
ALL_PATHS_CYPHER = """
MATCH (start), (end)
WHERE elementId(start) = $start_node_id AND elementId(end) = $end_node_id
MATCH path = (start)-[*1..$max_depth]-(end)
RETURN path
LIMIT $limit
"""

# K跳邻居查询
K_HOP_NEIGHBORS_CYPHER = """
MATCH (start)
WHERE elementId(start) = $node_id OR toString(start.name) = $node_id
CALL {
  WITH start
  MATCH path = (start)-[*1..$hops]-(neighbor)
  RETURN path
  LIMIT $limit
}
WITH DISTINCT path
UNWIND range(0, size(relationships(path)) - 1) AS idx
WITH
  nodes(path)[idx] AS n,
  relationships(path)[idx] AS r,
  nodes(path)[idx + 1] AS m
RETURN n, r, m
LIMIT $limit
"""

# 度中心性计算（简化版）
DEGREE_CENTRALITY_CYPHER = """
MATCH (n)-[r]-()
WITH n, count(r) AS degree
ORDER BY degree DESC
LIMIT $limit
RETURN n, degree
"""

# 介数中心性计算（使用APOC插件）
BETWEENNESS_CENTRALITY_CYPHER = """
CALL gds.betweenness.stream({
  nodeProjection: $node_projection,
  relationshipProjection: $relationship_projection
})
YIELD nodeId, score
RETURN gds.util.asNode(nodeId) AS node, score
ORDER BY score DESC
LIMIT $limit
"""

# PageRank算法
PAGERANK_CYPHER = """
CALL gds.pageRank.stream({
  nodeProjection: $node_projection,
  relationshipProjection: $relationship_projection,
  maxIterations: 20,
  dampingFactor: 0.85
})
YIELD nodeId, score
RETURN gds.util.asNode(nodeId) AS node, score
ORDER BY score DESC
LIMIT $limit
"""

# 社区发现 - Louvain算法
COMMUNITY_DETECTION_LOUVAIN_CYPHER = """
CALL gds.louvain.stream({
  nodeProjection: $node_projection,
  relationshipProjection: $relationship_projection
})
YIELD nodeId, communityId
RETURN gds.util.asNode(nodeId) AS node, communityId
ORDER BY communityId
"""

# 社区发现 - Label Propagation算法
COMMUNITY_DETECTION_LPA_CYPHER = """
CALL gds.labelPropagation.stream({
  nodeProjection: $node_projection,
  relationshipProjection: $relationship_projection
})
YIELD nodeId, communityId
RETURN gds.util.asNode(nodeId) AS node, communityId
ORDER BY communityId
"""

# 三角形计数
TRIANGLE_COUNT_CYPHER = """
CALL gds.triangleCount.stream({
  nodeProjection: $node_projection,
  relationshipProjection: $relationship_projection
})
YIELD nodeId, triangleCount
RETURN gds.util.asNode(nodeId) AS node, triangleCount
ORDER BY triangleCount DESC
LIMIT $limit
"""

# 聚类系数计算
CLUSTERING_COEFFICIENT_CYPHER = """
CALL gds.localClusteringCoefficient.stream({
  nodeProjection: $node_projection,
  relationshipProjection: $relationship_projection
})
YIELD nodeId, localClusteringCoefficient
RETURN gds.util.asNode(nodeId) AS node, localClusteringCoefficient
ORDER BY localClusteringCoefficient DESC
LIMIT $limit
"""

# ==================== 数据统计查询 ====================

# 节点类型分布统计
NODE_TYPE_DISTRIBUTION_CYPHER = """
MATCH (n)
RETURN labels(n) as node_labels, count(n) as count
ORDER BY count DESC
"""

# 关系类型分布统计
RELATIONSHIP_TYPE_DISTRIBUTION_CYPHER = """
MATCH ()-[r]-()
RETURN type(r) as relationship_type, count(r) as count
ORDER BY count DESC
"""

# 图的基本统计信息
GRAPH_BASIC_STATS_CYPHER = """
MATCH (n)
OPTIONAL MATCH ()-[r]-()
RETURN 
  count(DISTINCT n) as total_nodes,
  count(r) as total_relationships,
  count(DISTINCT labels(n)) as unique_node_types,
  count(DISTINCT type(r)) as unique_relationship_types
"""

# 节点度数分布
NODE_DEGREE_DISTRIBUTION_CYPHER = """
MATCH (n)-[r]-()
WITH n, count(r) as degree
RETURN degree, count(n) as node_count
ORDER BY degree
"""

# 连通组件分析
CONNECTED_COMPONENTS_CYPHER = """
CALL gds.wcc.stream({
  nodeProjection: $node_projection,
  relationshipProjection: $relationship_projection
})
YIELD nodeId, componentId
WITH componentId, count(nodeId) as component_size
RETURN componentId, component_size
ORDER BY component_size DESC
"""

# ==================== 复杂查询条件 ====================

# 时间范围过滤查询
TIME_RANGE_FILTER_CYPHER = """
MATCH (n)-[r]-(m)
WHERE r.timestamp >= $start_time AND r.timestamp <= $end_time
RETURN n, r, m
LIMIT $limit
"""

# 属性过滤查询
PROPERTY_FILTER_CYPHER = """
MATCH (n)-[r]-(m)
WHERE 
  ($node_filters IS NULL OR all(key IN keys($node_filters) WHERE n[key] = $node_filters[key]))
  AND ($relationship_filters IS NULL OR all(key IN keys($relationship_filters) WHERE r[key] = $relationship_filters[key]))
RETURN n, r, m
LIMIT $limit
"""

# 多跳查询（可变长度路径）
MULTI_HOP_QUERY_CYPHER = """
MATCH (start)-[path*$min_hops..$max_hops]-(end)
WHERE elementId(start) = $start_node_id
  AND ($end_node_id IS NULL OR elementId(end) = $end_node_id)
  AND ($relationship_types IS NULL OR all(r IN relationships(path) WHERE type(r) IN $relationship_types))
RETURN start, path, end
LIMIT $limit
"""

# 复合条件查询
COMPLEX_FILTER_QUERY_CYPHER = """
MATCH (n)-[r]-(m)
WHERE 
  ($node_labels IS NULL OR any(label IN $node_labels WHERE label IN labels(n)))
  AND ($relationship_types IS NULL OR type(r) IN $relationship_types)
  AND ($start_time IS NULL OR r.timestamp >= $start_time)
  AND ($end_time IS NULL OR r.timestamp <= $end_time)
  AND ($min_weight IS NULL OR r.weight >= $min_weight)
  AND ($max_weight IS NULL OR r.weight <= $max_weight)
RETURN n, r, m
LIMIT $limit
"""

# 查找共享标识符的用户对
FIND_SHARED_IDENTIFIERS_CYPHER = """
MATCH (u1:User)-->(identifier)<--(u2:User)
WHERE id(u1) < id(u2) // 避免重复和自环
RETURN u1, u2, identifier
LIMIT 50
"""
# ==================== ??????? ====================

SEARCH_GRAPH_CYPHER = """
MATCH (n)
WHERE any(val IN [n.name, n.term, n.title, n.alias, n.type] WHERE val IS NOT NULL AND toLower(toString(val)) CONTAINS toLower($query))
  AND ($labels IS NULL OR size($labels) = 0 OR any(label IN labels(n) WHERE label IN $labels))
OPTIONAL MATCH (n)-[r]-(m)
WITH n, r, m
LIMIT $limit
RETURN n, r, m
"""

EXPAND_NODE_CYPHER = """
MATCH (n)
WHERE elementId(n) = $node_id OR n.node_id = $node_id OR n.name = $node_id
WITH n
MATCH (n)-[r]-(m)
RETURN n, r, m
LIMIT $limit
"""

# ==================== ?????? ====================

FILTER_GRAPH_CYPHER = """
MATCH (n)-[r]-(m)
WHERE
    ($node_labels IS NULL OR size($node_labels) = 0 OR any(label IN labels(n) WHERE label IN $node_labels))
    AND ($relationship_types IS NULL OR size($relationship_types) = 0 OR type(r) IN $relationship_types)
    AND (
          $search IS NULL OR $search = '' OR
          toLower(coalesce(n.name, '')) CONTAINS toLower($search) OR
          toLower(coalesce(m.name, '')) CONTAINS toLower($search)
        )
RETURN n, r, m
LIMIT $limit
"""

TOP_DEGREE_NODES_CYPHER = """
MATCH (n)
OPTIONAL MATCH (n)-[r]-()
WITH n, count(r) AS degree
WHERE degree > 0
ORDER BY degree DESC
SKIP $skip
LIMIT $limit
RETURN n, degree
"""

NODE_LABEL_USAGE_CYPHER = """
MATCH (n)
UNWIND labels(n) AS label
RETURN label, count(*) AS count
ORDER BY count DESC
LIMIT $limit
"""

RELATIONSHIP_USAGE_CYPHER = """
MATCH ()-[r]-()
RETURN type(r) AS type, count(*) AS count
ORDER BY count DESC
LIMIT $limit
"""

UNIVERSAL_SEARCH_CYPHER = """
CALL {
  MATCH (n)
  WHERE any(val IN keys(n) WHERE toLower(toString(n[val])) CONTAINS toLower($query))
  OPTIONAL MATCH (n)-[r]-()
  WITH n, count(r) AS degree
  RETURN 'node' AS kind,
         elementId(n) AS id,
         labels(n) AS labels,
         properties(n) AS properties,
         degree
  ORDER BY degree DESC
  LIMIT $node_limit
}
UNION ALL
CALL {
  MATCH (a)-[r]-(b)
  WHERE any(key IN keys(r) WHERE toLower(toString(r[key])) CONTAINS toLower($query))
        OR toLower(type(r)) CONTAINS toLower($query)
  RETURN 'relationship' AS kind,
         elementId(r) AS id,
         type(r) AS type,
         properties(r) AS properties,
         elementId(a) AS source,
         elementId(b) AS target
  LIMIT $relationship_limit
}
RETURN kind, id, labels, type, properties, source, target, degree
"""
