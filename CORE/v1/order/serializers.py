from rest_framework import serializers
from order.models import Order, OrderItem
from food.models import Food
from cart.models import CartItem


class FoodSerializer(serializers.ModelSerializer):
    class Meta:
        model = Food
        fields = ['id', 'name', 'price', 'description', 'image']


class CartItemSerializer(serializers.ModelSerializer):
    food_item = FoodSerializer(read_only=True)

    class Meta:
        model = CartItem
        fields = ['id', 'food_item', 'quantity']


class OrderItemSerializer(serializers.ModelSerializer):
    food_item = FoodSerializer(read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'food_item', 'quantity', 'price']


class OrderSerializer(serializers.ModelSerializer):
    """Serializer for orders, including order items."""
    items = OrderItemSerializer(
        source='order_items', many=True, read_only=True)
    cart_items = CartItemSerializer(
        source='cart.items', many=True, read_only=True)

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
            "cart_items",
            "status",
            "created_at",
        ]
        read_only_fields = ["id", "user", "created_at"]
