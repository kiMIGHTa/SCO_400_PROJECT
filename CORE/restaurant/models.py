from django.db import models
from django.conf import settings

# Create your models here.


class Restaurant(models.Model):
    name = models.CharField(max_length=255)
    description = models.CharField(max_length=255, default="No description provided.")
    image = models.ImageField(upload_to="restaurant_images/", blank=True, null=True)
    rating = models.IntegerField(blank=True, null=True)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="owned_restaurant")  
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class RestaurantStaff(models.Model):
    ROLE_CHOICES = [
        ('manager', 'Manager'),
        ('chef', 'Chef'),
        ('cashier', 'Cashier'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="staff_roles")
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name="staff_members")
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='cashier')

    class Meta:
        unique_together = ('user', 'restaurant')  # Prevent duplicate entries

    def __str__(self):
        return f"{self.user.email} - {self.role} at {self.restaurant.name}"

