from django.urls import path
from .views import mpesa_validation, mpesa_confirmation, initiate_payment

urlpatterns = [
    path("validation/", mpesa_validation, name="mpesa-validation"),
    path("confirmation/", mpesa_confirmation, name="mpesa-confirmation"),
    path("simulate/", initiate_payment, name="mpesa-simulate"),
]
