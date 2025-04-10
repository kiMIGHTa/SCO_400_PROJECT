# v1/auth/urls.py
from django.urls import path
from v1.auth.views import CreateUserView, CustomTokenObtainPairView, LogoutView, ProfileView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('register/', CreateUserView.as_view(), name="create_user_account"),
    path('profile/', ProfileView.as_view(), name="user_profile"),
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path("logout/", LogoutView.as_view(), name="logout"),  # Add logout
]

