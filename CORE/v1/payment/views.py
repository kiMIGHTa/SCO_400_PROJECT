from django.shortcuts import render
import json
import logging
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from v1.payment.mpesa import MpesaAPI
from order.models import Order

# Create your views here.


logger = logging.getLogger(__name__)

@csrf_exempt
def mpesa_validation(request):
    """Handle M-Pesa validation request"""
    data = json.loads(request.body)
    logger.info(f"Validation request: {data}")
    return JsonResponse({"ResultCode": 0, "ResultDesc": "Accepted"})

@csrf_exempt
def mpesa_confirmation(request):
    """Handle M-Pesa payment confirmation"""
    data = json.loads(request.body)
    logger.info(f"Payment confirmation received: {data}")

    transaction_id = data.get("TransID")
    amount = data.get("TransAmount")
    phone_number = data.get("MSISDN")
    order_id = data.get("BillRefNumber")  # Ensure order ID is sent as BillRefNumber
    
    try:
        order = Order.objects.get(id=order_id, status="paid-pending")
        if float(amount) == float(order.total_price):
            order.status = "processing"
            order.save()
            logger.info(f"Order {order_id} marked as 'processing'")
            return JsonResponse({"ResultCode": 0, "ResultDesc": "Success"})
        else:
            logger.warning(f"Payment amount mismatch for order {order_id}")
            return JsonResponse({"ResultCode": 1, "ResultDesc": "Amount Mismatch"})
    except Order.DoesNotExist:
        logger.error(f"Order {order_id} not found")
        return JsonResponse({"ResultCode": 1, "ResultDesc": "Order Not Found"})

@csrf_exempt
def initiate_payment(request):
    """API to initiate M-Pesa payment (STK Push or C2B Simulation)."""
    if request.method != "POST":
        return JsonResponse({"error": "Only POST requests are allowed"}, status=405)

    try:
        data = json.loads(request.body)
        amount = data.get("amount", 1)
        phone_number = data.get("phone_number", 254769375587)
        order_id = data.get("order_id")

        if not order_id:
            return JsonResponse({"error": "Order ID is required"}, status=400)

        # Initiate STK Push
        response = MpesaAPI.stk_push_request(amount, phone_number)

        return JsonResponse(response)

    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON payload"}, status=400)

@csrf_exempt
def check_payment_status(request):
    """API to check M-Pesa STK Push payment status."""
    if request.method != "POST":
        return JsonResponse({"error": "Only POST requests are allowed"}, status=405)

    try:
        data = json.loads(request.body)
        checkout_request_id = data.get("checkout_request_id")

        if not checkout_request_id:
            return JsonResponse({"error": "checkout_request_id is required"}, status=400)

        # Query STK Push payment status
        response = MpesaAPI.stk_query_status(checkout_request_id)

        return JsonResponse(response)

    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON payload"}, status=400)