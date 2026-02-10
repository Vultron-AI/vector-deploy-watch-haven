"""
Tests for products API views.
"""

import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

from products.models import Category, Product


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
        description="Luxury watches",
    )


@pytest.fixture
def product(db, category):
    """Create a test product."""
    return Product.objects.create(
        name="Test Watch",
        slug="test-watch",
        description="A beautiful test watch",
        price="1999.99",
        category=category,
        brand="TestBrand",
        stock_quantity=10,
        is_active=True,
        is_featured=True,
    )


@pytest.fixture
def inactive_product(db, category):
    """Create an inactive test product."""
    return Product.objects.create(
        name="Inactive Watch",
        slug="inactive-watch",
        description="An inactive watch",
        price="999.99",
        category=category,
        stock_quantity=5,
        is_active=False,
    )


class TestCategoryListView:
    """Tests for the category list endpoint."""

    def test_list_categories(self, api_client, category):
        """Test listing all categories."""
        url = reverse("products:category-list")
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 1
        assert response.data[0]["name"] == "Luxury"
        assert response.data[0]["slug"] == "luxury"

    def test_list_categories_empty(self, api_client, db):
        """Test listing categories when none exist."""
        url = reverse("products:category-list")
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 0


class TestProductListView:
    """Tests for the product list endpoint."""

    def test_list_products(self, api_client, product):
        """Test listing all active products."""
        url = reverse("products:product-list")
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert response.data["count"] == 1
        assert response.data["results"][0]["name"] == "Test Watch"

    def test_list_products_excludes_inactive(self, api_client, product, inactive_product):
        """Test that inactive products are excluded."""
        url = reverse("products:product-list")
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert response.data["count"] == 1
        assert response.data["results"][0]["name"] == "Test Watch"

    def test_filter_by_category(self, api_client, product, category, db):
        """Test filtering products by category."""
        # Create another category with a product
        other_category = Category.objects.create(name="Sport", slug="sport")
        Product.objects.create(
            name="Sport Watch",
            slug="sport-watch",
            price="599.99",
            category=other_category,
            stock_quantity=5,
        )

        url = reverse("products:product-list")
        response = api_client.get(url, {"category": "luxury"})

        assert response.status_code == status.HTTP_200_OK
        assert response.data["count"] == 1
        assert response.data["results"][0]["name"] == "Test Watch"

    def test_search_products(self, api_client, product):
        """Test searching products."""
        url = reverse("products:product-list")
        response = api_client.get(url, {"search": "beautiful"})

        assert response.status_code == status.HTTP_200_OK
        assert response.data["count"] == 1

    def test_list_products_empty(self, api_client, db):
        """Test listing products when none exist."""
        url = reverse("products:product-list")
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert response.data["count"] == 0


class TestProductDetailView:
    """Tests for the product detail endpoint."""

    def test_get_product_detail(self, api_client, product):
        """Test retrieving a single product."""
        url = reverse("products:product-detail", kwargs={"pk": product.id})
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert response.data["name"] == "Test Watch"
        assert response.data["description"] == "A beautiful test watch"
        assert response.data["price"] == "1999.99"
        assert response.data["is_featured"] is True
        assert response.data["category"]["name"] == "Luxury"

    def test_get_nonexistent_product(self, api_client, db):
        """Test retrieving a non-existent product."""
        import uuid
        url = reverse("products:product-detail", kwargs={"pk": uuid.uuid4()})
        response = api_client.get(url)

        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_get_inactive_product_returns_404(self, api_client, inactive_product):
        """Test that inactive products return 404."""
        url = reverse("products:product-detail", kwargs={"pk": inactive_product.id})
        response = api_client.get(url)

        assert response.status_code == status.HTTP_404_NOT_FOUND


class TestProductBySlugView:
    """Tests for the product by slug endpoint."""

    def test_get_product_by_slug(self, api_client, product):
        """Test retrieving a product by slug."""
        url = reverse("products:product-by-slug", kwargs={"slug": product.slug})
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert response.data["name"] == "Test Watch"

    def test_get_nonexistent_slug(self, api_client, db):
        """Test retrieving a product with non-existent slug."""
        url = reverse("products:product-by-slug", kwargs={"slug": "nonexistent"})
        response = api_client.get(url)

        assert response.status_code == status.HTTP_404_NOT_FOUND
