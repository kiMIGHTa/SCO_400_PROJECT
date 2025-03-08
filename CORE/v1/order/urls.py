from django.urls import path
from .views import OrderListView, CreateOrderView, OrderDetailView, CompleteOrderView

urlpatterns = [
    path("", OrderListView.as_view(), name="order-list"),  # GET all orders
    path("create/", CreateOrderView.as_view(), name="order-create"),  # POST create order
    path("<int:order_id>/", OrderDetailView.as_view(), name="order-detail"),  # GET specific order
    path("<int:order_id>/complete/", CompleteOrderView.as_view(), name="order-complete"),  # POST mark order as delivered
]
