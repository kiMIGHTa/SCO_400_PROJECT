from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """Serializer for retrieving user details (without password)."""
    
    class Meta:
        model = User
        exclude = ['password']
        read_only_fields = ['id']

class CustomUserCreateSerializer(serializers.ModelSerializer):
    """Serializer for user registration and profile"""
    
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'contact', 'has_restaurant', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])  # Hash password
        return super().create(validated_data)

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """mount important user data to the token"""
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add only essential user details
        token['email'] = user.email
        token['first_name'] = user.first_name
        token['has_restaurant'] = user.has_restaurant  # Example of a role indicator
        return token


    """Customize JWT token response to include user info"""

    def validate(self, attrs):
        data = super().validate(attrs)
        data.update({
            'user_id': self.user.id,
            'email': self.user.email,
            'has_restaurant': self.user.has_restaurant,
        })
        return data
