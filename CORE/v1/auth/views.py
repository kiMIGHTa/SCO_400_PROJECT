from django.shortcuts import render
from django.contrib.auth import get_user_model
from django.utils.timezone import now
from datetime import timedelta
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomUserCreateSerializer, CustomTokenObtainPairSerializer

# Create your views here.

User = get_user_model()

def get_tokens_for_user(user):
    """Generate JWT tokens for authenticated users."""
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

class CustomTokenObtainPairView(TokenObtainPairView):
    """JWT Login View"""
    serializer_class = CustomTokenObtainPairSerializer

class CreateUserView(APIView):
    """User Registration View"""
    permission_classes = [AllowAny]  # Allow anyone to create an account

    def post(self, request):
        serializer = CustomUserCreateSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            # Assign default values
            user.has_restaurant = request.data.get('has_restaurant', False)
            # user.created_at = now()
            user.save()

            tokens = get_tokens_for_user(user)
            return Response({
                'message': 'User created successfully!',
                'data': {
                    'tokens': tokens,
                    'user': CustomUserCreateSerializer(user).data
                }
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
