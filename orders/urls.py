from django.urls import path

from .views import (
    CartView,
    CartAddView,
    CartItemView,
    CartClearView,
    CheckoutView,
    OrderDetailView,
)

app_name = "orders"

urlpatterns = [
    path("cart/", CartView.as_view(), name="cart"),
    path("cart/items/", CartAddView.as_view(), name="cart-add"),
    path("cart/items/<uuid:product_id>/", CartItemView.as_view(), name="cart-item"),
    path("cart/clear/", CartClearView.as_view(), name="cart-clear"),
    path("checkout/", CheckoutView.as_view(), name="checkout"),
    path("orders/<uuid:order_id>/", OrderDetailView.as_view(), name="order-detail"),
]
