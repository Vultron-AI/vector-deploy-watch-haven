from django.urls import path

from .views import (
    CategoryListView,
    ProductListView,
    ProductDetailView,
    ProductBySlugView,
)

app_name = "products"

urlpatterns = [
    path("categories/", CategoryListView.as_view(), name="category-list"),
    path("", ProductListView.as_view(), name="product-list"),
    path("<uuid:pk>/", ProductDetailView.as_view(), name="product-detail"),
    path("by-slug/<slug:slug>/", ProductBySlugView.as_view(), name="product-by-slug"),
]
