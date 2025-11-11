# backend/graph_api/urls.py
from django.urls import path
from .views import (
    InitialGraphView, FilteredGraphView, NodeDetailView,
    GraphMetadataView, GraphSearchView, GraphUniversalSearchView, NodeExpandView,
    NodeCRUDView, RelationshipCRUDView, GraphAnalysisView,
    GraphStatisticsView, ComplexQueryView
)

app_name = 'graph_api'

urlpatterns = [
    # Entry points for common retrieval patterns
    path('initial/', InitialGraphView.as_view(), name='initial_graph'),
    path('filtered/', FilteredGraphView.as_view(), name='filtered_graph'),
    path('metadata/', GraphMetadataView.as_view(), name='graph_metadata'),
    path('search/', GraphSearchView.as_view(), name='graph_search'),
    path('search/universal/', GraphUniversalSearchView.as_view(), name='graph_universal_search'),
    path('node/<str:node_id>/', NodeDetailView.as_view(), name='node_detail'),
    path('node/<str:node_id>/expand/', NodeExpandView.as_view(), name='node_expand'),

    # CRUD endpoints for nodes and relationships
    path('nodes/', NodeCRUDView.as_view(), name='node_crud'),
    path('relationships/', RelationshipCRUDView.as_view(), name='relationship_crud'),

    # Advanced graph analytics
    path('analysis/', GraphAnalysisView.as_view(), name='graph_analysis'),

    # Statistical summaries
    path('statistics/', GraphStatisticsView.as_view(), name='graph_statistics'),

    # Complex query interface
    path('query/', ComplexQueryView.as_view(), name='complex_query'),
]
