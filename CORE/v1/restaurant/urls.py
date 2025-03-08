from django.urls import path
from .views import (
    RestaurantListView,
    RestaurantCreateView,
    RestaurantDetailView,
    RestaurantStaffListCreateView,
    RestaurantStaffDetailView
)

urlpatterns = [
    # Restaurant URLs
    path("", RestaurantListView.as_view(), name="restaurant-list"),
    path("create/", RestaurantCreateView.as_view(),name="restaurant-create"),
    path("<int:pk>/", RestaurantDetailView.as_view(), name="restaurant-detail"),

    # Restaurant Staff URLs
    path("staff/", RestaurantStaffListCreateView.as_view(),name="restaurant-staff-list"),
    path("staff/<int:pk>/",RestaurantStaffDetailView.as_view(), name="restaurant-staff-detail"),
]
