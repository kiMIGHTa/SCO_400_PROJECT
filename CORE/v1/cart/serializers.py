from rest_framework import serializers
from cart.models import Cart, CartItem
from food.models import Food
from v1.food.serializers import FoodSerializer


class CartItemSerializer(serializers.ModelSerializer):
    """Serializer for items inside the cart."""
    food_item = FoodSerializer(read_only=True)  # Include food item details
    food_item_id = serializers.PrimaryKeyRelatedField(
        queryset=Food.objects.all(), source="food_item", write_only=True
    )

    class Meta:
        model = CartItem
        fields = ["id", "food_item", "food_item_id", "quantity"]


class CartSerializer(serializers.ModelSerializer):
    """Serializer for the cart, including all items."""
    items = CartItemSerializer(many=True, read_only=True)

    class Meta:
        model = Cart
        fields = ["id", "user", "items", "created_at"]
        read_only_fields = ["id", "user", "created_at"]
