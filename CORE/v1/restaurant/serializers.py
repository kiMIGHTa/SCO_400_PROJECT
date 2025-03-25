# v1.restaurant.serializers.py
from rest_framework import serializers
from restaurant.models import Restaurant, RestaurantStaff
from django.contrib.auth import get_user_model

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model"""
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name',
                  'last_name', 'contact', 'is_staff']


class RestaurantSerializer(serializers.ModelSerializer):
    """Serializer for Restaurant"""
    class Meta:
        model = Restaurant
        fields = '__all__'
        read_only_fields = ['id', 'owner', 'created_at']

    def create(self, validated_data):
        """Ensure the logged-in user is set as the owner"""
        request = self.context.get('request')  # Access request from context
        validated_data['owner'] = request.user
        return super().create(validated_data)


class RestaurantStaffSerializer(serializers.ModelSerializer):
    """Serializer for Restaurant Staff"""
    email = serializers.EmailField(write_only=True)
    user = UserSerializer(read_only=True)
    is_staff = serializers.BooleanField(write_only=True, required=False)

    class Meta:
        model = RestaurantStaff
        fields = ['id', 'user', 'restaurant', 'role', 'email', 'is_staff']
        read_only_fields = ['id', 'user', 'restaurant']

    def create(self, validated_data):
        email = validated_data.pop('email')
        try:
            user = User.objects.get(email=email)
            if user.has_restaurant:
                raise serializers.ValidationError(
                    "This user already owns a restaurant.")
            return super().create({**validated_data, 'user': user})
        except User.DoesNotExist:
            raise serializers.ValidationError(
                "User with this email does not exist.")

    def update(self, instance, validated_data):
        is_staff = validated_data.pop('is_staff', None)
        if is_staff is not None:
            instance.user.is_staff = is_staff
            instance.user.save()
        return super().update(instance, validated_data)
