from django.urls import path
from .views import CartDetailView, AddToCartView, UpdateCartItemView, RemoveFromCartView

urlpatterns = [
    path("", CartDetailView.as_view(), name="cart-detail"),  # GET cart
    path("add/", AddToCartView.as_view(), name="cart-add"),  # POST add item to cart
    path("update/<int:cart_item_id>/", UpdateCartItemView.as_view(), name="cart-update"),  # PATCH update item
    path("remove/<int:cart_item_id>/", RemoveFromCartView.as_view(), name="cart-remove"),  # DELETE remove item
]
