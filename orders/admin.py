from django.contrib import admin

from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ["product", "product_name", "product_price", "quantity", "line_total"]

    def line_total(self, obj):
        return f"${obj.line_total:.2f}"


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "customer_email",
        "customer_full_name",
        "total",
        "payment_status",
        "order_status",
        "created_at",
    ]
    list_filter = ["payment_status", "order_status", "created_at"]
    search_fields = [
        "id",
        "customer_email",
        "customer_first_name",
        "customer_last_name",
    ]
    readonly_fields = [
        "id",
        "subtotal",
        "tax",
        "total",
        "created_at",
        "updated_at",
    ]
    inlines = [OrderItemInline]
    ordering = ["-created_at"]

    fieldsets = (
        ("Customer Information", {
            "fields": (
                "customer_email",
                "customer_first_name",
                "customer_last_name",
                "customer_phone",
            )
        }),
        ("Shipping Address", {
            "fields": (
                "shipping_address_line1",
                "shipping_address_line2",
                "shipping_city",
                "shipping_state",
                "shipping_postal_code",
                "shipping_country",
            )
        }),
        ("Order Details", {
            "fields": (
                "subtotal",
                "shipping_cost",
                "tax",
                "total",
                "payment_status",
                "order_status",
            )
        }),
        ("Notes", {
            "fields": ("notes",),
        }),
        ("Metadata", {
            "fields": ("id", "created_at", "updated_at"),
            "classes": ("collapse",),
        }),
    )


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ["order", "product_name", "quantity", "product_price", "line_total"]
    list_filter = ["order__order_status"]
    search_fields = ["product_name", "order__customer_email"]
    readonly_fields = ["id", "created_at", "updated_at", "line_total"]

    def line_total(self, obj):
        return f"${obj.line_total:.2f}"
