from django.shortcuts import render
from django.contrib.auth import get_user_model
from django.utils.timezone import now
from datetime import timedelta
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomUserCreateSerializer, CustomTokenObtainPairSerializer, UserSerializer

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

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()  # Blacklist refresh token
            return Response({"message": "Logout successful"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)
        
class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Retrieve the authenticated user's profile data."""
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request):
        """Update the authenticated user's profile data."""
        user = request.user
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        """Soft delete the authenticated user's account."""
        user = request.user
        user.deleted = True
        user.is_active = False
        user.save()
        return Response({"message": "Account deleted successfully."}, status=status.HTTP_204_NO_CONTENT)