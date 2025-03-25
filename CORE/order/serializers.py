from rest_framework import serializers
from .models import Order
from cart.serializers import CartSerializer


class OrderSerializer(serializers.ModelSerializer):
    cart = CartSerializer(read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'cart', 'total_price', 'first_name', 'last_name',
            'email', 'phone_number', 'street', 'region', 'city',
            'status', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']
