from __future__ import annotations

from decimal import Decimal

from django.db import models

from shared.models import BaseModel
from products.models import Product


class Order(BaseModel):
    """
    Order model representing a customer purchase.
    """

    class PaymentStatus(models.TextChoices):
        PENDING = "pending", "Pending"
        PROCESSING = "processing", "Processing"
        COMPLETED = "completed", "Completed"
        FAILED = "failed", "Failed"
        REFUNDED = "refunded", "Refunded"

    class OrderStatus(models.TextChoices):
        PENDING = "pending", "Pending"
        CONFIRMED = "confirmed", "Confirmed"
        PROCESSING = "processing", "Processing"
        SHIPPED = "shipped", "Shipped"
        DELIVERED = "delivered", "Delivered"
        CANCELLED = "cancelled", "Cancelled"

    # Customer information
    customer_email = models.EmailField()
    customer_first_name = models.CharField(max_length=100)
    customer_last_name = models.CharField(max_length=100)
    customer_phone = models.CharField(max_length=20, blank=True)

    # Shipping address
    shipping_address_line1 = models.CharField(max_length=200)
    shipping_address_line2 = models.CharField(max_length=200, blank=True)
    shipping_city = models.CharField(max_length=100)
    shipping_state = models.CharField(max_length=100)
    shipping_postal_code = models.CharField(max_length=20)
    shipping_country = models.CharField(max_length=100, default="United States")

    # Order details
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal("0.00"))
    shipping_cost = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal("0.00"))
    tax = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal("0.00"))
    total = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal("0.00"))

    # Status
    payment_status = models.CharField(
        max_length=20,
        choices=PaymentStatus.choices,
        default=PaymentStatus.PENDING,
    )
    order_status = models.CharField(
        max_length=20,
        choices=OrderStatus.choices,
        default=OrderStatus.PENDING,
    )

    # Notes
    notes = models.TextField(blank=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"Order {self.id} - {self.customer_email}"

    @property
    def customer_full_name(self) -> str:
        """Return customer's full name."""
        return f"{self.customer_first_name} {self.customer_last_name}"

    @property
    def shipping_address(self) -> str:
        """Return formatted shipping address."""
        lines = [
            self.shipping_address_line1,
            self.shipping_address_line2,
            f"{self.shipping_city}, {self.shipping_state} {self.shipping_postal_code}",
            self.shipping_country,
        ]
        return "\n".join(line for line in lines if line)

    def calculate_totals(self) -> None:
        """Calculate and update order totals based on items."""
        self.subtotal = sum(
            item.line_total for item in self.items.all()
        )
        # Simple tax calculation (8%)
        self.tax = self.subtotal * Decimal("0.08")
        self.total = self.subtotal + self.shipping_cost + self.tax

    def save(self, *args, **kwargs) -> None:
        # Recalculate totals if items exist
        if self.pk:
            self.calculate_totals()
        super().save(*args, **kwargs)


class OrderItem(BaseModel):
    """
    OrderItem model representing a single item in an order.
    """

    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(
        Product, on_delete=models.PROTECT, related_name="order_items"
    )
    product_name = models.CharField(max_length=200)  # Snapshot of product name at order time
    product_price = models.DecimalField(max_digits=10, decimal_places=2)  # Snapshot of price
    quantity = models.PositiveIntegerField(default=1)

    class Meta:
        ordering = ["created_at"]

    def __str__(self) -> str:
        return f"{self.quantity}x {self.product_name}"

    @property
    def line_total(self) -> Decimal:
        """Calculate total price for this line item."""
        return self.product_price * self.quantity

    def save(self, *args, **kwargs) -> None:
        # Snapshot product details if not set
        if not self.product_name:
            self.product_name = self.product.name
        if not self.product_price:
            self.product_price = self.product.price
        super().save(*args, **kwargs)
