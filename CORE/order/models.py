from django.db import models
from django.contrib.auth import get_user_model
from cart.models import Cart
from food.models import Food

User = get_user_model()


class OrderItem(models.Model):
    """Model to store order items after cart is cleared"""
    order = models.ForeignKey(
        'Order', on_delete=models.CASCADE, related_name='order_items')
    food_item = models.ForeignKey(Food, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    # Store price at time of order
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.quantity}x {self.food_item.name} in Order #{self.order.id}"


class Order(models.Model):
    STATUS_CHOICES = [
        ("paid-pending", "Paid - Pending Confirmation"),
        ("processing", "Processing"),
        ("awaiting-pickup", "Awaiting Pickup"),
        ("out-for-delivery", "Out for Delivery"),
        ("delivered", "Delivered"),
        ("cancelled", "Cancelled"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    cart = models.ForeignKey(
        Cart, on_delete=models.SET_NULL, null=True, blank=True)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)

    # New fields with default values
    first_name = models.CharField(max_length=100, default="N/A")
    last_name = models.CharField(max_length=100, default="N/A")
    email = models.EmailField(default="N/A")
    phone_number = models.CharField(max_length=20, default="N/A")
    street = models.CharField(max_length=255, default="N/A")
    region = models.CharField(max_length=100, default="N/A")
    city = models.CharField(max_length=100, default="N/A")

    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default="paid-pending")
    created_at = models.DateTimeField(auto_now_add=True)

    def complete_order(self):
        """Marks order as delivered and clears user's cart."""
        if self.status != "delivered":
            # First, create OrderItem records for each cart item
            if self.cart and self.cart.items.exists():
                for cart_item in self.cart.items.all():
                    OrderItem.objects.create(
                        order=self,
                        food_item=cart_item.food_item,
                        quantity=cart_item.quantity,
                        price=cart_item.food_item.price
                    )
                # Then clear the cart
                self.cart.items.all().delete()
                self.cart.total_price = 0.00
                self.cart.save()

            self.status = "delivered"
            self.save()

    def __str__(self):
        return f"Order #{self.id} - {self.user.first_name} {self.user.last_name} [{self.get_status_display()}]"
