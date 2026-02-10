from decimal import Decimal

from django.db import transaction
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from products.models import Product
from products.serializers import ProductListSerializer
from .models import Order, OrderItem
from .cart import Cart
from .serializers import (
    OrderSerializer,
    AddToCartSerializer,
    UpdateCartItemSerializer,
    CheckoutSerializer,
)


class CartView(APIView):
    """
    Get current cart contents.
    GET /api/cart/
    """

    permission_classes = [AllowAny]

    def get(self, request):
        cart = Cart(request.session)
        items = cart.get_items()

        # Serialize products
        serialized_items = []
        for item in items:
            serialized_items.append({
                "product_id": item["product_id"],
                "product": ProductListSerializer(item["product"]).data,
                "quantity": item["quantity"],
                "line_total": str(item["line_total"]),
            })

        return Response({
            "items": serialized_items,
            "subtotal": str(cart.subtotal),
            "item_count": cart.item_count,
        })


class CartAddView(APIView):
    """
    Add item to cart.
    POST /api/cart/items/
    """

    permission_classes = [AllowAny]

    def post(self, request):
        serializer = AddToCartSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        product_id = serializer.validated_data["product_id"]
        quantity = serializer.validated_data["quantity"]

        try:
            product = Product.objects.active().get(id=product_id)
        except Product.DoesNotExist:
            return Response(
                {"error": "Product not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        cart = Cart(request.session)
        cart.add(product, quantity)

        return Response({
            "message": f"Added {quantity} x {product.name} to cart",
            "item_count": cart.item_count,
            "subtotal": str(cart.subtotal),
        }, status=status.HTTP_201_CREATED)


class CartItemView(APIView):
    """
    Update or remove cart item.
    PUT /api/cart/items/{product_id}/
    DELETE /api/cart/items/{product_id}/
    """

    permission_classes = [AllowAny]

    def put(self, request, product_id):
        serializer = UpdateCartItemSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        cart = Cart(request.session)
        cart.update(str(product_id), serializer.validated_data["quantity"])

        return Response({
            "message": "Cart updated",
            "item_count": cart.item_count,
            "subtotal": str(cart.subtotal),
        })

    def delete(self, request, product_id):
        cart = Cart(request.session)
        cart.remove(str(product_id))

        return Response({
            "message": "Item removed from cart",
            "item_count": cart.item_count,
            "subtotal": str(cart.subtotal),
        })


class CartClearView(APIView):
    """
    Clear all items from cart.
    DELETE /api/cart/
    """

    permission_classes = [AllowAny]

    def delete(self, request):
        cart = Cart(request.session)
        cart.clear()

        return Response({
            "message": "Cart cleared",
            "item_count": 0,
            "subtotal": "0.00",
        })


class CheckoutView(APIView):
    """
    Process checkout and create order.
    POST /api/checkout/
    """

    permission_classes = [AllowAny]

    @transaction.atomic
    def post(self, request):
        serializer = CheckoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        cart = Cart(request.session)

        if cart.item_count == 0:
            return Response(
                {"error": "Cart is empty"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Create order
        order_data = {
            key: value
            for key, value in serializer.validated_data.items()
            if not key.startswith("card_")  # Exclude payment fields
        }

        order = Order.objects.create(**order_data)

        # Create order items
        for item in cart.get_items():
            OrderItem.objects.create(
                order=order,
                product=item["product"],
                product_name=item["product"].name,
                product_price=item["price"],
                quantity=item["quantity"],
            )

        # Calculate totals
        order.calculate_totals()
        order.save()

        # Simulate payment processing (placeholder)
        # In production, integrate with Stripe, PayPal, etc.
        order.payment_status = Order.PaymentStatus.COMPLETED
        order.order_status = Order.OrderStatus.CONFIRMED
        order.save()

        # Clear cart
        cart.clear()

        return Response(
            OrderSerializer(order).data,
            status=status.HTTP_201_CREATED,
        )


class OrderDetailView(APIView):
    """
    Get order details.
    GET /api/orders/{order_id}/
    """

    permission_classes = [AllowAny]

    def get(self, request, order_id):
        try:
            order = Order.objects.prefetch_related("items").get(id=order_id)
        except Order.DoesNotExist:
            return Response(
                {"error": "Order not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        return Response(OrderSerializer(order).data)
