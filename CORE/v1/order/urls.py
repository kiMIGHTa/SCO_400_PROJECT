from django.urls import path
from .views import CreateOrderView, OrderDetailView, CompleteOrderView, RestaurantOrderViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'restaurant', RestaurantOrderViewSet,
                basename='restaurant-orders')

urlpatterns = [
    # path("", OrderListView.as_view(), name="order-list"),  # GET all orders
    path("create/", CreateOrderView.as_view(),
         name="order-create"),  # POST create order
    path("<int:order_id>/", OrderDetailView.as_view(),
         name="order-detail"),  # GET specific order
    path("<int:order_id>/complete/", CompleteOrderView.as_view(),
         name="order-complete"),  # POST mark order as delivered
    *router.urls,  # Include the restaurant order endpoints
]
