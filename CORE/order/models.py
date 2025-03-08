from django.db import models
from django.contrib.auth import get_user_model
from cart.models import Cart

User = get_user_model()

class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    cart = models.ForeignKey(Cart, on_delete=models.SET_NULL, null=True, blank=True)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(
        max_length=20,
        choices=[("pending", "Pending"), ("delivered", "Delivered"), ("cancelled", "Cancelled")],
        default="pending",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def complete_order(self):
        """Marks order as delivered and clears user's cart."""
        self.status = "delivered"
        self.save()
        if self.cart:
            self.cart.items.all().delete()  # Clear cart items after delivery
            self.cart.total_price = 0.00
            self.cart.save()

    def __str__(self):
        return f"Order {self.id} - {self.user.username} ({self.status})"
