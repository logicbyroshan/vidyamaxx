"""
VidyaFloww Common Pagination

Standardized pagination classes for consistent API responses.
"""

from rest_framework.pagination import PageNumberPagination, CursorPagination


class StandardResultsSetPagination(PageNumberPagination):
    """
    Default pagination for list endpoints.

    TODO: Adjust page_size and limits based on performance profiling.
    """
    page_size = 20
    page_size_query_param = "page_size"
    max_page_size = 100
    page_query_param = "page"


class LargeResultsSetPagination(PageNumberPagination):
    """
    Pagination for endpoints returning larger data sets (e.g., reports).

    TODO: Implement with streaming response for very large exports.
    """
    page_size = 100
    page_size_query_param = "page_size"
    max_page_size = 500


class CursorResultsSetPagination(CursorPagination):
    """
    Cursor-based pagination for real-time feed endpoints (e.g., activity log).

    TODO: Use for notification and activity streams.
    """
    page_size = 20
    ordering = "-created_at"
