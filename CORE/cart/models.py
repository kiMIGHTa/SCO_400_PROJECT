from django.db import models
from django.contrib.auth import get_user_model
from food.models import Food

# Create your models here.

User = get_user_model()

class Cart(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)  # Each user has one cart
    created_at = models.DateTimeField(auto_now_add=True)

    def clear_cart(self):
        """Clear cart after successful checkout or delivery."""
        self.items.all().delete()  # Deletes all cart items

    def __str__(self):
        return f"Cart - {self.user.username}"


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name="items")
    food_item = models.ForeignKey(Food, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.quantity}x {self.food_item.name} in {self.cart.user.username}'s cart"
