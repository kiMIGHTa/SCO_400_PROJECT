from django.db import models
from django.contrib.auth import get_user_model
from order.models import Order


User = get_user_model()

# Create your models here.
class Payment(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("completed", "Completed"),
        ("failed", "Failed"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    order = models.OneToOneField(Order, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    transaction_id = models.CharField(max_length=100, blank=True, null=True)  # M-Pesa transaction ID
    created_at = models.DateTimeField(auto_now_add=True)

    def confirm_payment(self, transaction_id):
        """Marks payment as completed and updates order status."""
        self.status = "completed"
        self.transaction_id = transaction_id
        self.save()
        self.order.status = "processing"  # Move order to processing
        self.order.save()

    def __str__(self):
        return f"Payment for Order {self.order.id} - {self.status}"
