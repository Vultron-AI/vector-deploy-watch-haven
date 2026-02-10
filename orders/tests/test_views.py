"""
Tests for orders API views.
"""

import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

from products.models import Category, Product
from orders.models import Order, OrderItem


@pytest.fixture
def api_client():
    """Return an API client instance."""
    return APIClient()


@pytest.fixture
def category(db):
    """Create a test category."""
    return Category.objects.create(
        name="Luxury",
        slug="luxury",
    )


@pytest.fixture
def product(db, category):
    """Create a test product."""
    return Product.objects.create(
        name="Test Watch",
        slug="test-watch",
        price="1999.99",
        category=category,
        stock_quantity=10,
        is_active=True,
    )


@pytest.fixture
def order(db, product):
    """Create a test order."""
    order = Order.objects.create(
        customer_email="test@example.com",
        customer_first_name="John",
        customer_last_name="Doe",
        shipping_address_line1="123 Main St",
        shipping_city="New York",
        shipping_state="NY",
        shipping_postal_code="10001",
    )
    OrderItem.objects.create(
        order=order,
        product=product,
        product_name=product.name,
        product_price=product.price,
        quantity=2,
    )
    order.calculate_totals()
    order.save()
    return order


@pytest.mark.django_db
class TestCartView:
    """Tests for cart operations."""

    def test_get_empty_cart(self, api_client):
        """Test getting an empty cart."""
        url = reverse("orders:cart")
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert response.data["items"] == []
        assert response.data["item_count"] == 0
        assert response.data["subtotal"] == "0"


@pytest.mark.django_db
class TestCartAddView:
    """Tests for adding items to cart."""

    def test_add_item_to_cart(self, api_client, product):
        """Test adding an item to the cart."""
        url = reverse("orders:cart-add")
        response = api_client.post(url, {
            "product_id": str(product.id),
            "quantity": 2,
        })

        assert response.status_code == status.HTTP_201_CREATED
        assert response.data["item_count"] == 2
        assert "Added" in response.data["message"]

    def test_add_invalid_product(self, api_client):
        """Test adding a non-existent product."""
        import uuid
        url = reverse("orders:cart-add")
        response = api_client.post(url, {
            "product_id": str(uuid.uuid4()),
            "quantity": 1,
        })

        assert response.status_code == status.HTTP_404_NOT_FOUND


@pytest.mark.django_db
class TestCheckoutView:
    """Tests for checkout process."""

    def test_checkout_empty_cart(self, api_client):
        """Test checkout with empty cart."""
        url = reverse("orders:checkout")
        response = api_client.post(url, {
            "customer_email": "test@example.com",
            "customer_first_name": "John",
            "customer_last_name": "Doe",
            "shipping_address_line1": "123 Main St",
            "shipping_city": "New York",
            "shipping_state": "NY",
            "shipping_postal_code": "10001",
            "shipping_country": "United States",
            "card_number": "4111111111111111",
            "card_expiry": "12/2025",
            "card_cvc": "123",
        })

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "empty" in response.data["error"].lower()


@pytest.mark.django_db
class TestOrderDetailView:
    """Tests for order detail retrieval."""

    def test_get_order_detail(self, api_client, order):
        """Test retrieving an order."""
        url = reverse("orders:order-detail", kwargs={"order_id": order.id})
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert response.data["customer_email"] == "test@example.com"
        assert len(response.data["items"]) == 1

    def test_get_nonexistent_order(self, api_client):
        """Test retrieving a non-existent order."""
        import uuid
        url = reverse("orders:order-detail", kwargs={"order_id": uuid.uuid4()})
        response = api_client.get(url)

        assert response.status_code == status.HTTP_404_NOT_FOUND
