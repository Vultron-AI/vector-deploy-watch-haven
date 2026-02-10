from rest_framework import serializers

from products.serializers import ProductListSerializer
from .models import Order, OrderItem


class OrderItemSerializer(serializers.ModelSerializer):
    """Serializer for order items."""

    line_total = serializers.DecimalField(
        max_digits=10, decimal_places=2, read_only=True
    )

    class Meta:
        model = OrderItem
        fields = [
            "id",
            "product",
            "product_name",
            "product_price",
            "quantity",
            "line_total",
        ]
        read_only_fields = ["id", "product_name", "product_price", "line_total"]


class OrderSerializer(serializers.ModelSerializer):
    """Serializer for orders."""

    items = OrderItemSerializer(many=True, read_only=True)
    customer_full_name = serializers.CharField(read_only=True)
    shipping_address = serializers.CharField(read_only=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "customer_email",
            "customer_first_name",
            "customer_last_name",
            "customer_phone",
            "customer_full_name",
            "shipping_address_line1",
            "shipping_address_line2",
            "shipping_city",
            "shipping_state",
            "shipping_postal_code",
            "shipping_country",
            "shipping_address",
            "subtotal",
            "shipping_cost",
            "tax",
            "total",
            "payment_status",
            "order_status",
            "items",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "subtotal",
            "tax",
            "total",
            "payment_status",
            "order_status",
            "created_at",
            "updated_at",
        ]


class CartItemSerializer(serializers.Serializer):
    """Serializer for cart items (session-based)."""

    product_id = serializers.UUIDField()
    product = ProductListSerializer(read_only=True)
    quantity = serializers.IntegerField(min_value=1)
    line_total = serializers.DecimalField(
        max_digits=10, decimal_places=2, read_only=True
    )


class CartSerializer(serializers.Serializer):
    """Serializer for cart (session-based)."""

    items = CartItemSerializer(many=True, read_only=True)
    subtotal = serializers.DecimalField(
        max_digits=10, decimal_places=2, read_only=True
    )
    item_count = serializers.IntegerField(read_only=True)


class AddToCartSerializer(serializers.Serializer):
    """Serializer for adding items to cart."""

    product_id = serializers.UUIDField()
    quantity = serializers.IntegerField(min_value=1, default=1)


class UpdateCartItemSerializer(serializers.Serializer):
    """Serializer for updating cart item quantity."""

    quantity = serializers.IntegerField(min_value=1)


class CheckoutSerializer(serializers.Serializer):
    """Serializer for checkout process."""

    customer_email = serializers.EmailField()
    customer_first_name = serializers.CharField(max_length=100)
    customer_last_name = serializers.CharField(max_length=100)
    customer_phone = serializers.CharField(max_length=20, required=False, allow_blank=True)

    shipping_address_line1 = serializers.CharField(max_length=200)
    shipping_address_line2 = serializers.CharField(max_length=200, required=False, allow_blank=True)
    shipping_city = serializers.CharField(max_length=100)
    shipping_state = serializers.CharField(max_length=100)
    shipping_postal_code = serializers.CharField(max_length=20)
    shipping_country = serializers.CharField(max_length=100, default="United States")

    # Payment fields (placeholder - in production, use a payment processor)
    card_number = serializers.CharField(max_length=19, write_only=True)
    card_expiry = serializers.CharField(max_length=7, write_only=True)  # MM/YYYY
    card_cvc = serializers.CharField(max_length=4, write_only=True)
