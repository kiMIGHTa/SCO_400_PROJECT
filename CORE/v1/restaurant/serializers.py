from rest_framework import serializers
from restaurant.models import Restaurant, RestaurantStaff
from django.contrib.auth import get_user_model

User = get_user_model()

class RestaurantSerializer(serializers.ModelSerializer):
    """Serializer for Restaurant"""
    class Meta:
        model = Restaurant
        fields = ['id', 'name', 'image', 'description', 'rating', 'owner', 'created_at']
        read_only_fields = ['id', 'owner', 'created_at']

    def create(self, validated_data):
        """Ensure the logged-in user is set as the owner"""
        request = self.context.get('request')  # Access request from context
        validated_data['owner'] = request.user
        return super().create(validated_data)

class RestaurantStaffSerializer(serializers.ModelSerializer):
    """Serializer for Restaurant Staff"""

    class Meta:
        model = RestaurantStaff
        fields = ['id', 'user', 'restaurant', 'role']
