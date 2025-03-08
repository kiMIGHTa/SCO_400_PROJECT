from django.shortcuts import render
from rest_framework import generics
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from restaurant.models import Restaurant, RestaurantStaff
from .serializers import RestaurantSerializer, RestaurantStaffSerializer


from rest_framework.permissions import IsAuthenticated, AllowAny
from v1.permissions import IsRestaurantOwner
from rest_framework.parsers import MultiPartParser, FormParser


from django.contrib.auth import get_user_model

# Create your views here.


User = get_user_model()

# -------------------------
# Restaurant Views
# -------------------------


class RestaurantListView(generics.ListAPIView):
    """List all restaurants."""
    queryset = Restaurant.objects.all()
    serializer_class = RestaurantSerializer
    permission_classes = [AllowAny]  # Any authenticated user can view


class RestaurantCreateView(generics.CreateAPIView):
    """Allow authenticated users to create a restaurant"""
    serializer_class = RestaurantSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]  # Allow file uploads

    def perform_create(self, serializer):
        """Ensure only one restaurant per user."""
        if self.request.user.has_restaurant:
            return Response({"error": "User already owns a restaurant"}, status=400)
        serializer.save(owner=self.request.user)
        self.request.user.has_restaurant = True
        self.request.user.save()


class RestaurantDetailView(generics.RetrieveUpdateDestroyAPIView):
    """View, update, or delete a restaurant (only owner)."""
    queryset = Restaurant.objects.all()
    serializer_class = RestaurantSerializer
    # Only owner can edit/delete
    permission_classes = [IsAuthenticated, IsRestaurantOwner]

# -------------------------
# Restaurant Staff Views
# -------------------------


class RestaurantStaffListCreateView(generics.ListCreateAPIView):
    """List all staff (only for restaurant owners) or allow a restaurant owner to add staff."""
    serializer_class = RestaurantStaffSerializer
    # Only owners can view & add staff
    permission_classes = [IsAuthenticated, IsRestaurantOwner]

    def get_queryset(self):
        """Restrict staff list to the restaurant owned by the user."""
        return RestaurantStaff.objects.filter(restaurant__owner=self.request.user)

    def perform_create(self, serializer):
        """Ensure only the restaurant owner can add staff."""
        restaurant = get_object_or_404(
            Restaurant, id=self.request.data.get("restaurant"))
        if restaurant.owner != self.request.user:
            return Response({"error": "Only the restaurant owner can add staff."}, status=403)
        serializer.save()


class RestaurantStaffDetailView(generics.RetrieveUpdateDestroyAPIView):
    """View, update, or remove a staff member (only owner can modify)."""
    queryset = RestaurantStaff.objects.all()
    serializer_class = RestaurantStaffSerializer
    # Only owner can manage staff
    permission_classes = [IsAuthenticated, IsRestaurantOwner]

    def get_object(self):
        """Ensure only the restaurant owner can modify staff roles."""
        staff = get_object_or_404(RestaurantStaff, id=self.kwargs["pk"])
        if staff.restaurant.owner != self.request.user:
            self.permission_denied(
                self.request, message="Not authorized to modify staff")
        return staff
