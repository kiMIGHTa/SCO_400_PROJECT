from rest_framework import serializers
from food.models import Food
from v1.restaurant.serializers import RestaurantSerializer

class FoodSerializer(serializers.ModelSerializer):
    restaurant = RestaurantSerializer(read_only=True)

    class Meta:
        model = Food
        fields = "__all__"
