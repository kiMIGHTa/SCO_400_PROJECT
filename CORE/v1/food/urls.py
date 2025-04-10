#v1.food.urls.py

from django.urls import path
from .views import FoodListCreateView, FoodDetailView,FoodListView

urlpatterns = [
    path('<int:restaurant_id>/menu/', FoodListCreateView.as_view(), name="food_list_create"),
    path('<int:pk>/', FoodDetailView.as_view(), name="food_detail"),
    path('', FoodListView.as_view(), name="all_food_list"),
]
