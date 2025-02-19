from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from food.models import Food
from restaurant.models import Restaurant
from .serializers import FoodSerializer
from .permissions import IsRestaurantOwnerOrStaff
from rest_framework.parsers import MultiPartParser, FormParser


class FoodListCreateView(generics.ListCreateAPIView):
    """List all foods for a restaurant and allow owners/staff to add new ones."""
    serializer_class = FoodSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]  # Allow file uploads


    def get_queryset(self):
        """Get food items belonging to a specific restaurant."""
        return Food.objects.filter(restaurant__id=self.kwargs["restaurant_id"])

    def perform_create(self, serializer):
        """Ensure only restaurant owners/staff can add food items."""
        restaurant = get_object_or_404(Restaurant, id=self.kwargs["restaurant_id"])

        if not (restaurant.owner == self.request.user or restaurant.staff.filter(id=self.request.user.id).exists()):
            return Response({"error": "Only restaurant owner or staff can add food items."}, status=403)

        serializer.save(restaurant=restaurant)

class FoodDetailView(generics.RetrieveUpdateDestroyAPIView):
    """View, update, or delete food items (only for restaurant owner/staff)."""
    queryset = Food.objects.all()
    serializer_class = FoodSerializer
    permission_classes = [IsAuthenticated, IsRestaurantOwnerOrStaff]
