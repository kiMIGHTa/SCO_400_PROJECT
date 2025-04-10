from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RestaurantOrderViewSet

router = DefaultRouter()
router.register(r'restaurant', RestaurantOrderViewSet,
                basename='restaurant-orders')

# Debug: Print out the generated URL patterns
for url in router.urls:
    print(f"URL pattern: {url.pattern}")

urlpatterns = [
    path('', include(router.urls)),
]
