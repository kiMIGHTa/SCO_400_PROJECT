from django.core.management.base import BaseCommand
from v1.payment.mpesa import MpesaAPI

class Command(BaseCommand):
    help = "Register M-Pesa confirmation and validation URLs"

    def handle(self, *args, **kwargs):
        response = MpesaAPI.register_urls()
        self.stdout.write(self.style.SUCCESS(f"Response: {response}"))
