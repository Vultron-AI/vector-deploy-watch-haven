"""
Tests for cart functionality.
"""

import pytest
from decimal import Decimal
from unittest.mock import MagicMock

from products.models import Category, Product
from orders.cart import Cart


@pytest.fixture
def category(db):
    """Create a test category."""
    return Category.objects.create(name="Luxury", slug="luxury")


@pytest.fixture
def product(db, category):
    """Create a test product."""
    return Product.objects.create(
        name="Test Watch",
        price=Decimal("1999.99"),
        category=category,
        stock_quantity=10,
    )


@pytest.fixture
def product2(db, category):
    """Create a second test product."""
    return Product.objects.create(
        name="Another Watch",
        price=Decimal("2499.99"),
        category=category,
        stock_quantity=5,
    )


@pytest.fixture
def session():
    """Create a mock session."""
    session_data = {}
    session = MagicMock()
    session.__getitem__ = lambda self, key: session_data.get(key)
    session.__setitem__ = lambda self, key, value: session_data.__setitem__(key, value)
    session.__contains__ = lambda self, key: key in session_data
    session.__delitem__ = lambda self, key: session_data.__delitem__(key)
    session.get = session_data.get
    session.modified = False
    return session


class TestCart:
    """Tests for the Cart class."""

    def test_cart_starts_empty(self, session):
        """Test that a new cart is empty."""
        cart = Cart(session)
        assert len(cart) == 0
        assert cart.item_count == 0
        assert cart.subtotal == Decimal("0")

    def test_add_product(self, session, product):
        """Test adding a product to the cart."""
        cart = Cart(session)
        cart.add(product, quantity=1)

        assert len(cart) == 1
        assert cart.item_count == 1

    def test_add_product_multiple_times(self, session, product):
        """Test adding the same product multiple times."""
        cart = Cart(session)
        cart.add(product, quantity=1)
        cart.add(product, quantity=2)

        assert len(cart) == 1
        assert cart.item_count == 3

    def test_add_different_products(self, session, product, product2):
        """Test adding different products."""
        cart = Cart(session)
        cart.add(product, quantity=1)
        cart.add(product2, quantity=2)

        assert len(cart) == 2
        assert cart.item_count == 3

    def test_remove_product(self, session, product):
        """Test removing a product from the cart."""
        cart = Cart(session)
        cart.add(product, quantity=1)
        cart.remove(str(product.id))

        assert len(cart) == 0
        assert cart.item_count == 0

    def test_update_quantity(self, session, product):
        """Test updating product quantity."""
        cart = Cart(session)
        cart.add(product, quantity=1)
        cart.update(str(product.id), quantity=5)

        assert cart.item_count == 5

    def test_update_quantity_to_zero_removes(self, session, product):
        """Test that updating quantity to 0 removes the product."""
        cart = Cart(session)
        cart.add(product, quantity=1)
        cart.update(str(product.id), quantity=0)

        assert len(cart) == 0

    def test_subtotal_calculation(self, session, product, product2):
        """Test subtotal calculation."""
        cart = Cart(session)
        cart.add(product, quantity=2)  # 2 * 1999.99 = 3999.98
        cart.add(product2, quantity=1)  # 1 * 2499.99 = 2499.99

        expected = Decimal("3999.98") + Decimal("2499.99")
        assert cart.subtotal == expected

    def test_clear_cart(self, session, product, product2):
        """Test clearing the cart."""
        cart = Cart(session)
        cart.add(product, quantity=2)
        cart.add(product2, quantity=1)
        cart.clear()

        # Create a new cart instance to verify it's empty
        new_cart = Cart(session)
        assert len(new_cart) == 0
        assert new_cart.item_count == 0

    def test_get_items(self, session, product):
        """Test getting cart items with product details."""
        cart = Cart(session)
        cart.add(product, quantity=2)

        items = cart.get_items()
        assert len(items) == 1
        assert items[0]["product_id"] == str(product.id)
        assert items[0]["quantity"] == 2
        assert items[0]["product"].name == "Test Watch"
        assert items[0]["line_total"] == Decimal("3999.98")
