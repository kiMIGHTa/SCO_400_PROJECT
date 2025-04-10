from rest_framework import serializers
from payment.models import Payment

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ["id", "user", "order", "amount", "status", "transaction_id", "created_at"]
        read_only_fields = ["id", "user", "status", "transaction_id", "created_at"]
