from rest_framework import generics, filters
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend

from .models import Category, Product
from .serializers import CategorySerializer, ProductListSerializer, ProductDetailSerializer


class CategoryListView(generics.ListAPIView):
    """
    List all categories.
    GET /api/products/categories/
    """

    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]
    pagination_class = None  # Return all categories without pagination


class ProductListView(generics.ListAPIView):
    """
    List all active products with optional filtering.
    GET /api/products/
    GET /api/products/?category=luxury
    GET /api/products/?search=rolex
    GET /api/products/?is_featured=true
    """

    serializer_class = ProductListSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["category__slug", "is_featured"]
    search_fields = ["name", "description", "brand"]
    ordering_fields = ["price", "created_at", "name"]
    ordering = ["-created_at"]

    def get_queryset(self):
        queryset = Product.objects.active().select_related("category")

        # Filter by category slug if provided
        category = self.request.query_params.get("category")
        if category:
            queryset = queryset.filter(category__slug=category)

        return queryset


class ProductDetailView(generics.RetrieveAPIView):
    """
    Retrieve a single product by ID or slug.
    GET /api/products/{id}/
    GET /api/products/by-slug/{slug}/
    """

    serializer_class = ProductDetailSerializer
    permission_classes = [AllowAny]
    queryset = Product.objects.active().select_related("category")


class ProductBySlugView(generics.RetrieveAPIView):
    """
    Retrieve a single product by slug.
    GET /api/products/by-slug/{slug}/
    """

    serializer_class = ProductDetailSerializer
    permission_classes = [AllowAny]
    queryset = Product.objects.active().select_related("category")
    lookup_field = "slug"
