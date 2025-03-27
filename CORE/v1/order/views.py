from django.conf import settings
from rest_framework import generics, status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from order.models import Order
from cart.models import Cart
from payment.models import Payment
from .serializers import OrderSerializer
from v1.payment.mpesa import MpesaAPI
import time
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.core.mail import send_mail



class OrderListView(generics.ListAPIView):
    """List all orders for the current user"""
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).order_by('-created_at')


class CreateOrderView(generics.CreateAPIView):
    """Create an order and initiate M-Pesa STK push"""
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        print("CreateOrderView triggered")

        cart = get_object_or_404(Cart, user=request.user)
        restaurant = cart.items.first().food_item.restaurant.owner

        # Verify all items belong to the same restaurant
        for item in cart.items.all():
            if item.food_item.restaurant.owner != restaurant:
                return Response(
            {"error": "All items must be from the same restaurant"},
            status=status.HTTP_400_BAD_REQUEST
            )

        if not cart.items.exists():
            print("Cart is empty")
            return Response({"error": "Cart is empty"}, status=status.HTTP_400_BAD_REQUEST)

        phone_number = request.data.get("phone_number")
        if not phone_number:
            print("Phone number missing")
            return Response({"error": "Phone number is required"}, status=status.HTTP_400_BAD_REQUEST)

        # Extract order details from request
        first_name = request.data.get("first_name")
        last_name = request.data.get("last_name")
        email = request.data.get("email")
        total_price = request.data.get("total_price")
        street = request.data.get("street")
        region = request.data.get("region")
        city = request.data.get("city")

        # Validate required fields
        if not all([first_name, last_name, email, street, region, city]):
            print("Customer details missing")
            return Response({"error": "All customer details are required."}, status=status.HTTP_400_BAD_REQUEST)

        # Step 1: Create Order
        order = Order.objects.create(
            user=request.user,
            cart=cart,
            total_price=total_price,
            first_name=first_name,
            last_name=last_name,
            email=email,
            phone_number=phone_number,
            street=street,
            region=region,
            city=city,
            status="paid-pending",
            restaurant=restaurant # Set the restaurant owner
        )
        print(f"Order created: {order}")


        # Step 2: Initiate STK Push
        stk_response = MpesaAPI.stk_push_request(
            order.total_price, phone_number)
        print(f"STK Push response: {stk_response}")

        if "CheckoutRequestID" not in stk_response:
            print("M-Pesa STK push failed")
            return Response(
                {"error": "M-Pesa STK push failed",
                    "mpesa_response": stk_response},
                status=status.HTTP_400_BAD_REQUEST,
            )

        checkout_request_id = stk_response["CheckoutRequestID"]
        print("CheckoutRequestID", checkout_request_id)

        # Step 3: Create Payment Instance
        payment = Payment.objects.create(
            user=request.user,
            order=order,
            amount=order.total_price,
            status="pending",
        )
        print(f"Payment initialized: {payment}")

        # Step 4: Check Payment Status (Polling)
        for _ in range(5):  # Repeat the process 3 times
            query_response = MpesaAPI.stk_query_status(
                checkout_request_id)  # Query M-Pesa for payment status
            time.sleep(3)  # Pause execution for 4 seconds

            if query_response.get("ResultCode", "1") == "0":
                break  # Stop looping if payment is successful

        print(f"Payment query response: {query_response}")

        # Process response
        result_code = query_response.get(
            "ResultCode", "1")  # Default to failure
        if result_code == "0":
            # Successful payment
            payment.confirm_payment(transaction_id=checkout_request_id)
            
            # Send email receipt
            self.send_order_receipt(order)
            print(f"""Payment successful:
                {{
                    "message": "Payment successful",
                    "order_status": "{order.status}",
                    "payment_status": "{payment.status}"
                }}""")
            return Response(
                {
                    "order_id": order.id,
                    "message": "Payment successful",
                    "order_status": order.status,
                    "payment_status": payment.status,
                },
                status=status.HTTP_201_CREATED,
            )
        else:
            # Failed payment
            payment.status = "failed"
            payment.save()
            order.status = "cancelled"
            order.save()
            print("Payment failed")
            return Response(
                {
                    "error": "Payment failed",
                    "order_status": order.status,
                    "payment_status": payment.status,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

    def send_order_receipt(self, order):
        try:
            # Render both text and HTML versions
            text_content = f"Order #{order.id}\nTotal: KSh {order.total_price}"
            html_content = render_to_string(
                'order/emails/order_receipt.html',
                {'order': order}
            )
            
            # Send email
            send_mail(
                subject=f'Order #{order.id}',
                message=text_content,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[order.email],
                html_message=html_content,  # Optional HTML
                fail_silently=False
            )
        except Exception as e:
            print(f"EMAIL ERROR: {str(e)}")

class OrderDetailView(generics.RetrieveAPIView):
    """Retrieve details of a specific order"""
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return get_object_or_404(Order, id=self.kwargs["order_id"], user=self.request.user)


class CompleteOrderView(generics.UpdateAPIView):
    """Mark an order as delivered (automatically clears cart)"""
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return get_object_or_404(Order, id=self.kwargs["order_id"], user=self.request.user)

    def update(self, request, *args, **kwargs):
        order = self.get_object()
        if order.status == "delivered":
            return Response({"error": "Order is already completed."}, status=status.HTTP_400_BAD_REQUEST)
        order.complete_order()
        return Response({"message": "Order marked as delivered."})


class RestaurantOrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Directly filter by the restaurant owner (current user)
        return Order.objects.filter(
            restaurant=self.request.user
        ).order_by('-created_at')

    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        order = self.get_object()
        new_status = request.data.get('status')

        if not new_status:
            return Response(
                {'error': 'Status is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if new_status not in dict(Order.STATUS_CHOICES):
            return Response(
                {'error': 'Invalid status'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # If status is being changed to delivered, call complete_order
        if new_status == "delivered":
            order.complete_order()
        else:
            order.status = new_status
            order.save()

        serializer = self.get_serializer(order)
        return Response(serializer.data)
