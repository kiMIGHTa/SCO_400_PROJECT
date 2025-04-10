from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from cart.models import Cart, CartItem
from .serializers import CartSerializer, CartItemSerializer
from food.models import Food


class CartDetailView(generics.RetrieveAPIView):
    """Retrieve the user's cart"""
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        cart, created = Cart.objects.get_or_create(user=self.request.user)
        return cart


class AddToCartView(generics.CreateAPIView):
    """Add a food item to the cart"""
    serializer_class = CartItemSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        cart, created = Cart.objects.get_or_create(user=self.request.user)
        food_item = get_object_or_404(Food, id=self.request.data.get("food_item_id"))
        serializer.save(cart=cart, food_item=food_item)


class UpdateCartItemView(generics.UpdateAPIView):
    """Update the quantity of an item in the cart"""
    serializer_class = CartItemSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return get_object_or_404(CartItem, id=self.kwargs["cart_item_id"], cart__user=self.request.user)


class RemoveFromCartView(generics.DestroyAPIView):
    """Remove an item from the cart"""
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return get_object_or_404(CartItem, id=self.kwargs["cart_item_id"], cart__user=self.request.user)
