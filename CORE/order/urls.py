from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RestaurantOrderViewSet

router = DefaultRouter()
router.register(r'restaurant', RestaurantOrderViewSet,
                basename='restaurant-orders')

urlpatterns = [
    path('', include(router.urls)),
]
