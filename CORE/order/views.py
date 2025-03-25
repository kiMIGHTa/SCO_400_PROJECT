from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Order
from .serializers import OrderSerializer

# Create your views here.


class RestaurantOrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Get orders for the restaurant owned by the current user
        return Order.objects.filter(cart__restaurant__owner=self.request.user)

    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        order = self.get_object()
        new_status = request.data.get('status')

        if not new_status:
            return Response(
                {'error': 'Status is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if new_status not in dict(Order.STATUS_CHOICES):
            return Response(
                {'error': 'Invalid status'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # If status is being changed to delivered, call complete_order
        if new_status == "delivered":
            order.complete_order()
        else:
            order.status = new_status
            order.save()

        serializer = self.get_serializer(order)
        return Response(serializer.data)
