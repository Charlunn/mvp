# serializers.py
from rest_framework import serializers
from typing import List, Dict, Any, Optional, Union, Tuple, Set
import logging
import json

try:
    from neo4j.graph import Node as Neo4jNode, Relationship as Neo4jRelationship
except ImportError:
    Neo4jNode = None  # type: ignore
    Neo4jRelationship = None  # type: ignore


logger = logging.getLogger(__name__)


def _is_neo_node(value: Any) -> bool:
    return Neo4jNode is not None and isinstance(value, Neo4jNode)


def _is_neo_relationship(value: Any) -> bool:
    return Neo4jRelationship is not None and isinstance(value, Neo4jRelationship)


def normalise_node(node: Any) -> Optional[Dict[str, Any]]:
    """
    Converts Neo4j Node objects or dictionaries into a uniform dictionary structure.
    """
    if _is_neo_node(node):
        assert Neo4jNode is not None  # for type checkers
        data = {k: v for k, v in node.items()}
        data['labels'] = list(node.labels)
        data['element_id'] = getattr(node, "element_id", None)
        data['identity'] = getattr(node, "id", None)
        return data

    if isinstance(node, dict):
        return node

    if node is not None:
        logger.warning(f"Unable to normalise node of type {type(node)}")
    return None


def get_node_id(node: Any) -> Optional[str]:
    """
    Attempts to extract or generate a unique ID for a node representation.
    Prioritises intrinsic Neo4j IDs and falls back to common properties.
    """
    if _is_neo_node(node):
        element_id = getattr(node, "element_id", None)
        if element_id:
            return str(element_id)
        identity = getattr(node, "id", None)
        if identity is not None:
            return str(identity)
        node = normalise_node(node)

    if isinstance(node, dict):
        for key in ('element_id', 'node_id', 'id', 'name'):
            if key in node and node[key] is not None:
                return str(node[key])
        try:
            sorted_items = sorted(node.items())
            stringified_items = [(k, str(v)) for k, v in sorted_items]
            node_hash = hash(json.dumps(stringified_items))
            logger.debug(f"Generated fallback hash ID {node_hash} for node payload: {node}")
            return str(node_hash)
        except Exception as exc:
            logger.error(f"Could not generate fallback ID for node payload {node}: {exc}")
            return None

    if node is not None:
        logger.warning(f"Unsupported node type for ID extraction: {type(node)}")
    return None


def stringify_properties(properties: Dict[str, Any]) -> Dict[str, str]:
    return {key: str(value) for key, value in properties.items()}


def extract_relationship_payload(rel_payload: Any) -> Optional[Tuple[Any, Any, str, Dict[str, Any]]]:
    if _is_neo_relationship(rel_payload):
        assert Neo4jRelationship is not None
        try:
            start_node, end_node = rel_payload.nodes
        except Exception as exc:
            logger.warning(f"Unable to access nodes from Neo4j Relationship: {exc}")
            return None
        rel_type = getattr(rel_payload, "type", "RELATED")
        rel_properties = {k: v for k, v in rel_payload.items()}
        return start_node, end_node, rel_type, rel_properties

    if isinstance(rel_payload, tuple) and len(rel_payload) == 3:
        start_node, rel_type, end_node = rel_payload
        rel_properties: Dict[str, Any] = {}
        return start_node, end_node, rel_type, rel_properties

    if rel_payload is not None:
        logger.warning(f"Unrecognised relationship payload type: {type(rel_payload)}")
    return None


class EchartsGraphSerializer(serializers.Serializer):
    """
    Serialises Neo4j query results into the format required by ECharts graph charts.
    Supports both dictionary-based records and native Neo4j objects.
    """
    nodes = serializers.ListField(
        child=serializers.DictField(),
        read_only=True,
        help_text="List of nodes for ECharts graph."
    )
    links = serializers.ListField(
        child=serializers.DictField(),
        read_only=True,
        help_text="List of relationships for ECharts graph."
    )

    def _format_node(self, node_payload: Any) -> Optional[Dict[str, Any]]:
        node_dict = normalise_node(node_payload)
        if node_dict is None:
            return None

        node_id = get_node_id(node_payload)
        if node_id is None:
            logger.warning("Could not determine a unique ID for node: %s. Skipping.", node_payload)
            return None

        labels = node_dict.get('labels', []) or []

        candidate_fields = ['name']
        if 'Keyword' in labels:
            candidate_fields.insert(0, 'term')
        if 'AssetFlow' in labels:
            candidate_fields.insert(0, 'method')
        candidate_fields.extend(['term', 'method', 'description', 'type', 'value'])

        node_name = None
        for field in candidate_fields:
            value = node_dict.get(field)
            if value:
                node_name = value
                break

        if node_name is None:
            prefix = labels[0] if labels else 'Node'
            node_name = f"{prefix}-{node_id[-8:]}"

        category = (
            node_dict.get('type')
            or node_dict.get('label')
            or (labels[0] if labels else 'Default')
        )

        properties = stringify_properties(node_dict)

        return {
            'id': node_id,
            'name': str(node_name),
            'category': str(category),
            'symbolSize': 30,
            'value': node_dict.get('value', 1),
            'properties': properties,
        }

    def _format_link(self, rel_payload: Any) -> Optional[Tuple[Dict[str, Any], Any, Any]]:
        extracted = extract_relationship_payload(rel_payload)
        if not extracted:
            return None

        start_payload, end_payload, rel_type, rel_properties = extracted
        start_id = get_node_id(start_payload)
        end_id = get_node_id(end_payload)
        if not start_id or not end_id:
            logger.warning("Skipping relationship due to missing start/end IDs.")
            return None

        rel_properties_str = stringify_properties(rel_properties)
        rel_value = rel_properties.get('value', 1)
        try:
            rel_numeric_value = float(rel_value)
        except (TypeError, ValueError):
            rel_numeric_value = 1
        rel_type_str = str(rel_type)

        link = {
            'source': start_id,
            'target': end_id,
            'value': rel_numeric_value,
            'label': {
                'show': True,
                'formatter': rel_type_str
            },
            'lineStyle': {
                'width': 2,
                'curveness': 0.1
            },
            'properties': rel_properties_str,
            'type': rel_type_str
        }

        return link, start_payload, end_payload

    def to_representation(self, instance: Union[List[Dict], Any]) -> Dict[str, Any]:
        if not isinstance(instance, list):
            logger.warning(f"EchartsGraphSerializer received non-list input. Type: {type(instance)}. Returning empty graph.")
            return {'nodes': [], 'links': []}

        if not instance:
            logger.info("EchartsGraphSerializer received an empty list. Returning empty graph.")
            return {'nodes': [], 'links': []}

        logger.debug(f"Processing {len(instance)} records for ECharts graph.")

        nodes_data_dict: Dict[str, Dict[str, Any]] = {}
        links_data: List[Dict[str, Any]] = []

        for idx, record in enumerate(instance):
            if not isinstance(record, dict):
                logger.warning(f"Record at index {idx} is not a dict: {record}. Skipping.")
                continue

            node_n = record.get('n')
            node_m = record.get('m')
            rel_payload = record.get('r')

            formatted_node_n = self._format_node(node_n)
            if formatted_node_n:
                nodes_data_dict.setdefault(formatted_node_n['id'], formatted_node_n)

            formatted_node_m = self._format_node(node_m)
            if formatted_node_m:
                nodes_data_dict.setdefault(formatted_node_m['id'], formatted_node_m)

            formatted_rel = self._format_link(rel_payload)
            if formatted_rel:
                link, start_payload, end_payload = formatted_rel
                links_data.append(link)

                start_node = self._format_node(start_payload)
                if start_node:
                    nodes_data_dict.setdefault(start_node['id'], start_node)

                end_node = self._format_node(end_payload)
                if end_node:
                    nodes_data_dict.setdefault(end_node['id'], end_node)

        final_nodes_list = list(nodes_data_dict.values())
        logger.info(f"Serialized {len(final_nodes_list)} unique nodes and {len(links_data)} links for ECharts.")

        categories = [
            {'name': str(category)}
            for category in sorted({node.get('category', 'Default') for node in final_nodes_list})
        ]

        return {
            'nodes': final_nodes_list,
            'links': links_data,
            'categories': categories,
            'counts': {
                'nodes': len(final_nodes_list),
                'links': len(links_data)
            }
        }


class NodeDetailSerializer(serializers.Serializer):
    """
    Serialises detailed information for a specific node and its immediate neighbours.
    """
    node_properties = serializers.DictField(read_only=True, help_text="Properties of the target node.")
    neighbors = serializers.ListField(
        child=serializers.DictField(),
        read_only=True,
        help_text="List of neighbours connected by relationships."
    )

    def to_representation(self, instance: Union[List[Dict], Any]) -> Dict[str, Any]:
        if not isinstance(instance, list) or not instance:
            logger.warning("NodeDetailSerializer received invalid input. Returning empty detail payload.")
            return {'node_properties': {}, 'neighbors': []}

        first_record = instance[0]
        if not isinstance(first_record, dict):
            logger.warning("NodeDetailSerializer first record is not a dict. Returning empty detail payload.")
            return {'node_properties': {}, 'neighbors': []}

        target_node_payload = first_record.get('n')
        target_node_dict = normalise_node(target_node_payload)
        target_node_id = get_node_id(target_node_payload)

        if not target_node_dict or not target_node_id:
            logger.error("NodeDetailSerializer: Could not determine target node identity.")
            return {'node_properties': {}, 'neighbors': []}

        node_properties = stringify_properties(target_node_dict)
        node_properties['calculated_id'] = target_node_id
        node_properties['labels'] = target_node_dict.get('labels', [])

        neighbors_data: List[Dict[str, Any]] = []
        neighbor_ids_seen: Set[str] = set()

        for idx, record in enumerate(instance):
            if not isinstance(record, dict):
                continue

            rel_payload = record.get('r')
            neighbour_payload = record.get('m')

            extracted = extract_relationship_payload(rel_payload) if rel_payload else None
            rel_type = None
            start_payload = end_payload = None
            rel_properties: Dict[str, Any] = {}

            if extracted:
                start_payload, end_payload, rel_type, rel_properties = extracted

            neighbor_candidate = None
            direction = 'unknown'

            if start_payload and end_payload:
                start_id = get_node_id(start_payload)
                end_id = get_node_id(end_payload)
                if start_id == target_node_id:
                    neighbor_candidate = end_payload
                    direction = 'outgoing'
                elif end_id == target_node_id:
                    neighbor_candidate = start_payload
                    direction = 'incoming'

            if neighbor_candidate is None and neighbour_payload is not None:
                neighbor_candidate = neighbour_payload
                direction = 'related'

            if neighbor_candidate is None:
                logger.debug(f"NodeDetailSerializer record {idx}: unable to determine neighbour.")
                continue

            neighbor_id = get_node_id(neighbor_candidate)
            if not neighbor_id or neighbor_id in neighbor_ids_seen:
                continue

            neighbor_dict = normalise_node(neighbor_candidate) or {}
            neighbor_properties = stringify_properties(neighbor_dict)

            neighbors_data.append({
                'relationship_type': str(rel_type) if rel_type else 'RELATED',
                'relationship_properties': stringify_properties(rel_properties),
                'direction': direction,
                'neighbor_id': neighbor_id,
                'neighbor_labels': neighbor_dict.get('labels', []),
                'neighbor_name': neighbor_properties.get('name', neighbor_id),
                'neighbor_properties': neighbor_properties,
            })
            neighbor_ids_seen.add(neighbor_id)

        logger.info(
            f"Serialized details for node {node_properties.get('calculated_id', 'N/A')} "
            f"with {len(neighbors_data)} unique neighbour connections."
        )
        return {'node_properties': node_properties, 'neighbors': neighbors_data}


# Backward compatibility alias
GraphDataSerializer = EchartsGraphSerializer
