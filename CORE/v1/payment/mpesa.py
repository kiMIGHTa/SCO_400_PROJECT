from datetime import datetime
import requests
import os
import base64

# Load environment variables
MPESA_ENVIRONMENT = os.getenv("MPESA_ENVIRONMENT", "sandbox")
CONSUMER_KEY = os.getenv("MPESA_CONSUMER_KEY")
CONSUMER_SECRET = os.getenv("MPESA_CONSUMER_SECRET")
SHORTCODE = os.getenv("MPESA_SHORTCODE")
MPESA_EXPRESS_SHORTCODE = os.getenv("MPESA_SHORTCODE")

PASSKEY = os.getenv("MPESA_PASSKEY")  
CALLBACK_URL = os.getenv("MPESA_CALLBACK_URL")  

VALIDATION_URL = os.getenv("MPESA_VALIDATION_URL")
CONFIRMATION_URL = os.getenv("MPESA_CONFIRMATION_URL")

BASE_URL = os.getenv("MPESA_BASE_URL") if MPESA_ENVIRONMENT == "sandbox" else "https://api.safaricom.co.ke"

class MpesaAPI:
    @staticmethod
    def get_access_token():
        """Fetch access token from Safaricom API"""
        url = f"{BASE_URL}/oauth/v1/generate?grant_type=client_credentials"

        # Encode consumer key and secret for Basic Authentication
        auth_header = base64.b64encode(f"{CONSUMER_KEY}:{CONSUMER_SECRET}".encode()).decode()
        headers = {"Authorization": f"Basic {auth_header}"}
        
        response = requests.get(url, headers=headers)
        response_data = response.json()
        
        return response_data.get("access_token", None)
    

#=====================STK-PUSH MPESA EXPRESS DARAJA API ===========================================
    
    @staticmethod
    def generate_password():
        """Generate password for STK push request"""
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        password = base64.b64encode(f"{MPESA_EXPRESS_SHORTCODE}{PASSKEY}{timestamp}".encode()).decode()
        return password, timestamp

    @staticmethod
    def stk_push_request(amount, phone_number, account_reference="MPISHI", transaction_desc="Payment"):
        """Initiate STK push request"""
        url = f"{BASE_URL}/mpesa/stkpush/v1/processrequest"
        access_token = MpesaAPI.get_access_token()

        if not access_token:
            return {"error": "Failed to obtain access token"}

        password, timestamp = MpesaAPI.generate_password()

        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }

        payload = {
            "BusinessShortCode": MPESA_EXPRESS_SHORTCODE,
            "Password": password,
            "Timestamp": timestamp,
            "TransactionType": "CustomerPayBillOnline",
            "Amount": amount,
            "PartyA": phone_number,
            "PartyB": MPESA_EXPRESS_SHORTCODE,
            "PhoneNumber": phone_number,
            "CallBackURL": CALLBACK_URL,
            "AccountReference": account_reference,
            "TransactionDesc": transaction_desc
        }

        response = requests.post(url, json=payload, headers=headers)
        return response.json()

    @staticmethod
    def stk_query_status(checkout_request_id):
        """Check STK Push transaction status"""
        url = f"{BASE_URL}/mpesa/stkpushquery/v1/query"
        access_token = MpesaAPI.get_access_token()

        if not access_token:
            return {"error": "Failed to obtain access token"}

        password, timestamp = MpesaAPI.generate_password()

        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }

        payload = {
            "BusinessShortCode": MPESA_EXPRESS_SHORTCODE,
            "Password": password,
            "Timestamp": timestamp,
            "CheckoutRequestID": checkout_request_id,
        }

        response = requests.post(url, json=payload, headers=headers)
        return response.json()




#=====================C2B MPESA DARAJA API ===========================================

    @staticmethod
    def register_urls():
        """Register confirmation and validation URLs"""
        url = f"{BASE_URL}/mpesa/c2b/v1/registerurl"
        headers = {
            "Authorization": f"Bearer {MpesaAPI.get_access_token()}",
            "Content-Type": "application/json"
        }
        payload = {
            "ShortCode": SHORTCODE,
            "ResponseType": "Completed",
            "ConfirmationURL": CONFIRMATION_URL,
            "ValidationURL": VALIDATION_URL,
        }
        
        response = requests.post(url, json=payload, headers=headers)
        return response.json()

    @staticmethod
    def simulate_c2b_transaction(amount, phone_number, bill_ref_number):
        """Simulate C2B transaction for testing"""
        url = f"{BASE_URL}/mpesa/c2b/v1/simulate"
        headers = {
            "Authorization": f"Bearer {MpesaAPI.get_access_token()}",
            "Content-Type": "application/json"
        }
        payload = {
            "ShortCode": SHORTCODE,
            "CommandID": "CustomerPayBillOnline",
            "Amount": amount,
            "MSISDN": phone_number,
            "BillRefNumber": bill_ref_number
        }
        
        response = requests.post(url, json=payload, headers=headers)
        return response.json()
