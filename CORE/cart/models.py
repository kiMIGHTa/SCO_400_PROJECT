from django.db import models
from django.contrib.auth import get_user_model
from food.models import Food

User = get_user_model()

class Cart(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="cart")
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    created_at = models.DateTimeField(auto_now_add=True)

    def update_total_price(self):
        """Recalculate the total price of the cart."""
        self.total_price = sum(item.get_total_price() for item in self.items.all())
        self.save()

    def __str__(self):
        return f"Cart - {self.user.username}"


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name="items")
    food_item = models.ForeignKey(Food, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    def get_total_price(self):
        """Calculate total price for this cart item."""
        return self.food_item.price * self.quantity

    def save(self, *args, **kwargs):
        """Override save to update cart total price."""
        super().save(*args, **kwargs)
        self.cart.update_total_price()

    def delete(self, *args, **kwargs):
        """Override delete to update cart total price after removing an item."""
        super().delete(*args, **kwargs)
        self.cart.update_total_price()

    def __str__(self):
        return f"{self.quantity}x {self.food_item.name} in {self.cart.user.username}'s cart"
