from __future__ import annotations

from django.db import models
from django.utils.text import slugify

from shared.models import BaseModel


class Category(BaseModel):
    """
    Category model for organizing watches.
    Examples: Luxury, Sport, Casual, Vintage, Smart
    """

    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True, blank=True)
    description = models.TextField(blank=True)

    class Meta:
        verbose_name_plural = "categories"
        ordering = ["name"]

    def __str__(self) -> str:
        return self.name

    def save(self, *args, **kwargs) -> None:
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class ProductManager(models.Manager):
    """Custom manager for Product model."""

    def active(self):
        """Return only active products."""
        return self.filter(is_active=True)

    def by_category(self, category_slug: str):
        """Filter products by category slug."""
        return self.active().filter(category__slug=category_slug)


class Product(BaseModel):
    """
    Product model for watches.
    """

    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True, blank=True)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.ForeignKey(
        Category, on_delete=models.PROTECT, related_name="products"
    )
    image = models.URLField(max_length=500, blank=True, help_text="URL to product image")
    brand = models.CharField(max_length=100, blank=True)
    sku = models.CharField(max_length=50, unique=True, blank=True, null=True)
    stock_quantity = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)

    objects = ProductManager()

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return self.name

    def save(self, *args, **kwargs) -> None:
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    @property
    def is_in_stock(self) -> bool:
        """Check if product is in stock."""
        return self.stock_quantity > 0

    @property
    def formatted_price(self) -> str:
        """Return price formatted as currency."""
        return f"${self.price:,.2f}"
