from rest_framework import serializers
from order.models import Order
from v1.cart.serializers import CartItemSerializer


class OrderSerializer(serializers.ModelSerializer):
    """Serializer for orders, including cart items."""
    items = CartItemSerializer(source="cart.items", many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "user",
            "cart",
            "total_price",
            "first_name",
            "last_name",
            "email",
            "phone_number",
            "street",
            "region",
            "city",
            "items",
            "status",
            "created_at",
        ]
        read_only_fields = ["id", "user", "created_at"]
