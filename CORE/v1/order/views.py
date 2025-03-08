from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from order.models import Order
from cart.models import Cart
from .serializers import OrderSerializer


class OrderListView(generics.ListAPIView):
    """List all orders for the authenticated user"""
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)


class CreateOrderView(generics.CreateAPIView):
    """Create an order from the user's cart"""
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        cart = get_object_or_404(Cart, user=self.request.user)
        order = serializer.save(user=self.request.user, cart=cart, total_price=cart.get_total_price())
        order.complete_order()  # Clears the cart after order creation


class OrderDetailView(generics.RetrieveAPIView):
    """Retrieve details of a specific order"""
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return get_object_or_404(Order, id=self.kwargs["order_id"], user=self.request.user)


class CompleteOrderView(generics.UpdateAPIView):
    """Mark an order as delivered (automatically clears cart)"""
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return get_object_or_404(Order, id=self.kwargs["order_id"], user=self.request.user)

    def update(self, request, *args, **kwargs):
        order = self.get_object()
        order.complete_order()
        return Response({"message": "Order marked as delivered."})
