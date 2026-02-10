from rest_framework import serializers

from .models import Category, Product


class CategorySerializer(serializers.ModelSerializer):
    """Serializer for Category model."""

    product_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ["id", "name", "slug", "description", "product_count"]

    def get_product_count(self, obj) -> int:
        """Return count of active products in this category."""
        return obj.products.filter(is_active=True).count()


class ProductListSerializer(serializers.ModelSerializer):
    """Serializer for product list view (minimal data)."""

    category_name = serializers.CharField(source="category.name", read_only=True)

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "slug",
            "price",
            "image",
            "brand",
            "category_name",
            "is_featured",
        ]


class ProductDetailSerializer(serializers.ModelSerializer):
    """Serializer for product detail view (full data)."""

    category = CategorySerializer(read_only=True)
    is_in_stock = serializers.BooleanField(read_only=True)
    formatted_price = serializers.CharField(read_only=True)

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "slug",
            "description",
            "price",
            "formatted_price",
            "image",
            "brand",
            "sku",
            "stock_quantity",
            "is_in_stock",
            "is_active",
            "is_featured",
            "category",
            "created_at",
            "updated_at",
        ]
