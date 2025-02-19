from django.db import models
from restaurant.models import Restaurant
# Create your models here.


class Food(models.Model):
    name = models.CharField(max_length=255)
    image = models.ImageField(upload_to="food_images/")
    price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField()
    category = models.CharField(max_length=100)
    availability = models.BooleanField(default=True)  # Added field
    restaurant = models.ForeignKey(
        Restaurant, on_delete=models.CASCADE, related_name="menu"
    )

    def __str__(self):
        return f"{self.name} - {self.restaurant.name} - {'Available' if self.availability else 'Unavailable'}"

