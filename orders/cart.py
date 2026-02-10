"""
Session-based shopping cart implementation.
"""

from decimal import Decimal
from typing import Any

from products.models import Product


class Cart:
    """
    A session-based shopping cart.
    """

    CART_SESSION_KEY = "cart"

    def __init__(self, session) -> None:
        self.session = session
        cart = self.session.get(self.CART_SESSION_KEY)
        if cart is None:
            cart = self.session[self.CART_SESSION_KEY] = {}
        self.cart = cart

    def add(self, product: Product, quantity: int = 1) -> None:
        """Add a product to the cart or update its quantity."""
        product_id = str(product.id)
        if product_id not in self.cart:
            self.cart[product_id] = {
                "quantity": 0,
                "price": str(product.price),
            }
        self.cart[product_id]["quantity"] += quantity
        self.save()

    def remove(self, product_id: str) -> None:
        """Remove a product from the cart."""
        if product_id in self.cart:
            del self.cart[product_id]
            self.save()

    def update(self, product_id: str, quantity: int) -> None:
        """Update the quantity of a product in the cart."""
        if product_id in self.cart:
            self.cart[product_id]["quantity"] = quantity
            if quantity <= 0:
                self.remove(product_id)
            else:
                self.save()

    def save(self) -> None:
        """Mark the session as modified to save changes."""
        self.session.modified = True

    def clear(self) -> None:
        """Clear the cart."""
        del self.session[self.CART_SESSION_KEY]
        self.session.modified = True

    def get_items(self) -> list[dict[str, Any]]:
        """Get cart items with product details."""
        product_ids = list(self.cart.keys())
        products = Product.objects.filter(id__in=product_ids)
        products_dict = {str(p.id): p for p in products}

        items = []
        for product_id, item in self.cart.items():
            product = products_dict.get(product_id)
            if product:
                items.append({
                    "product_id": product_id,
                    "product": product,
                    "quantity": item["quantity"],
                    "price": Decimal(item["price"]),
                    "line_total": Decimal(item["price"]) * item["quantity"],
                })
        return items

    @property
    def subtotal(self) -> Decimal:
        """Calculate the total price of all items in the cart."""
        return sum(
            Decimal(item["price"]) * item["quantity"]
            for item in self.cart.values()
        )

    @property
    def item_count(self) -> int:
        """Return the total number of items in the cart."""
        return sum(item["quantity"] for item in self.cart.values())

    def __len__(self) -> int:
        """Return the number of unique products in the cart."""
        return len(self.cart)

    def __iter__(self):
        """Iterate over cart items."""
        return iter(self.get_items())
