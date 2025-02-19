from django.urls import path
from .views import FoodListCreateView, FoodDetailView

urlpatterns = [
    path('<int:restaurant_id>/foods/', FoodListCreateView.as_view(), name="food_list_create"),
    path('<int:pk>/', FoodDetailView.as_view(), name="food_detail"),
]
