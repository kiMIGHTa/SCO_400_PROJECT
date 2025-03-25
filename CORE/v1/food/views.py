#v1.food.views.py
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from food.models import Food
from restaurant.models import Restaurant
from .serializers import FoodSerializer
from v1.permissions import IsRestaurantOwnerOrStaff
from rest_framework.parsers import MultiPartParser, FormParser

class FoodListView(generics.ListAPIView):
    queryset = Food.objects.all()
    serializer_class = FoodSerializer
    permission_classes = [AllowAny]  

    def get_queryset(self):
        """
        Filter food items based on category query param.
        """
        queryset = Food.objects.all()
        category = self.request.query_params.get("category", None)

        if category:
            queryset = queryset.filter(category__iexact=category)

        return queryset

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class FoodListCreateView(generics.ListCreateAPIView):
    """
    List all foods (any authenticated user) and allow restaurant owners/staff to add new ones.
    """
    serializer_class = FoodSerializer
    parser_classes = [MultiPartParser, FormParser]  # Allow file uploads

    def get_queryset(self):
        """Get food items belonging to a specific restaurant."""
        return Food.objects.filter(restaurant__id=self.kwargs["restaurant_id"])

    def get_permissions(self):
        """Override permission handling based on request method."""
        if self.request.method == "POST":
            return [IsAuthenticated(), IsRestaurantOwnerOrStaff()]
        return [IsAuthenticated()]  # Only authentication needed to view food items

    def perform_create(self, serializer):
        """Ensure only restaurant owners/staff can add food items."""
        restaurant = get_object_or_404(Restaurant, id=self.kwargs["restaurant_id"])

        if not (restaurant.owner == self.request.user or restaurant.staff.filter(id=self.request.user.id).exists()):
            return Response({"error": "Only restaurant owner or staff can add food items."}, status=403)

        serializer.save(restaurant=restaurant)


class FoodDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    View details of a food item (any authenticated user),
    but only restaurant owners/staff can update or delete it.
    """
    queryset = Food.objects.all()
    serializer_class = FoodSerializer

    def get_permissions(self):
        """Override permission handling based on request method."""
        if self.request.method in ["PUT", "PATCH", "DELETE"]:
            return [IsAuthenticated(), IsRestaurantOwnerOrStaff()]
        return [IsAuthenticated()]  # Only authentication needed to view details
