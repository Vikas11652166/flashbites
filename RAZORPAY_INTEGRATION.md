# Razorpay Payment Integration - Complete Guide

## ✅ Integration Status: COMPLETED

Razorpay payment gateway has been successfully integrated into FlashBites for both UPI and Card payments.

---

## 🎯 What's Integrated

### Frontend
- ✅ Razorpay SDK loaded via CDN (`index.html`)
- ✅ Payment flow for UPI and Card payments (`Checkout.jsx`)
- ✅ Environment variable for Razorpay Key ID (`.env`)
- ✅ Payment verification and order status updates
- ✅ Payment modal with prefilled user details
- ✅ Payment success/failure handling
- ✅ Payment cancellation handling

### Backend
- ✅ Razorpay order creation endpoint (`/api/payments/razorpay/create-order`)
- ✅ Payment verification with signature validation (`/api/payments/verify`)
- ✅ Order payment status updates
- ✅ Payment record creation in database
- ✅ Razorpay credentials configured (`.env`)

---

## 🔐 Configuration

### Backend (.env)
```env
RAZORPAY_KEY_ID=your_razorpay_test_key_id
RAZORPAY_KEY_SECRET=your_razorpay_test_key_secret
```

### Frontend (.env)
```env
VITE_RAZORPAY_KEY_ID=your_razorpay_test_key_id
```

**Note:** These are TEST credentials. Replace with LIVE credentials for production.

---

## 🔄 Payment Flow

### 1. User Places Order
- User selects items and goes to checkout
- Chooses payment method (UPI or Card)
- Clicks "Place Order"

### 2. Order Creation
- Order is created in database with status: `pending`
- Payment status set to: `pending`
- Cart is cleared

### 3. Razorpay Payment Initiation
```javascript
// Create Razorpay order on backend
POST /api/payments/razorpay/create-order
Body: { orderId, amount }

Response: {
  orderId: "order_xxx",
  amount: 50000,  // in paise
  currency: "INR",
  paymentId: "payment_record_id"
}
```

### 4. Razorpay Checkout Opens
- Modal opens with payment options
- For UPI: Shows UPI apps and QR code
- For Card: Shows card input form
- User completes payment

### 5. Payment Success Handler
```javascript
handler: async function (response) {
  // Verify payment on backend
  POST /api/payments/verify
  Body: {
    paymentId: "payment_record_id",
    gateway: "razorpay",
    gatewayResponse: {
      razorpay_payment_id: "pay_xxx",
      razorpay_order_id: "order_xxx",
      razorpay_signature: "signature_xxx"
    }
  }
}
```

### 6. Backend Verification
- Verify Razorpay signature using HMAC SHA256
- Update payment status to: `success`
- Update order payment status to: `completed`
- Update order status to: `confirmed`

### 7. Redirect to Order Detail
- User sees order confirmation
- Payment status badge shows "Paid"
- Restaurant can now process the order

---

## 🔒 Security Features

### 1. Signature Verification
```javascript
const body = razorpay_order_id + '|' + razorpay_payment_id;
const expectedSignature = crypto
  .createHmac('sha256', RAZORPAY_KEY_SECRET)
  .update(body.toString())
  .digest('hex');

if (expectedSignature !== razorpay_signature) {
  return error('Invalid payment signature');
}
```

### 2. Payment Status Tracking
- Orders created with `paymentStatus: 'pending'`
- Only updated to `completed` after signature verification
- Restaurant warned not to process orders with pending payments

### 3. Duplicate Prevention
- Loading state prevents multiple clicks
- Cart cleared immediately after order creation
- Backend duplicate detection within 5 seconds

---

## 💳 Payment Methods

### 1. UPI Payment
- PhonePe, Google Pay, Paytm, etc.
- QR code display
- UPI ID input
- Intent-based payment

Configuration:
```javascript
method: {
  upi: true,
  card: false,
  netbanking: false,
  wallet: false
}
```

### 2. Card Payment
- Visa, Mastercard, Amex, RuPay
- Domestic and International cards
- 2FA/3D Secure authentication

Configuration:
```javascript
method: {
  upi: false,
  card: true,
  netbanking: false,
  wallet: false
}
```

### 3. Cash on Delivery (COD)
- No payment gateway needed
- Order placed directly
- Payment collected on delivery

---

## 🧪 Testing

### Test Cards (Razorpay Test Mode)
```
Success Card:
- Number: 4111 1111 1111 1111
- CVV: Any 3 digits
- Expiry: Any future date

Failure Card:
- Number: 4000 0000 0000 0002
- CVV: Any 3 digits
- Expiry: Any future date
```

### Test UPI IDs
```
Success: success@razorpay
Failure: failure@razorpay
```

### Testing Steps
1. Login to FlashBites
2. Add items to cart
3. Go to checkout
4. Select payment method (UPI or Card)
5. Click "Place Order"
6. Complete payment in Razorpay modal
7. Verify order status updates to "confirmed"
8. Check payment status shows "Paid"

---

## 🐛 Troubleshooting

### Issue: "Razorpay is not defined"
**Solution:** Razorpay SDK script is loaded in `index.html`
```html
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```

### Issue: Payment verification fails
**Solution:** Check signature verification in backend
- Ensure `RAZORPAY_KEY_SECRET` is correct
- Verify signature calculation matches Razorpay docs

### Issue: Order not confirmed after payment
**Solution:** Check network requests
- Verify `/api/payments/verify` endpoint is called
- Check order status update in backend
- Look for error logs in console

### Issue: Payment status still "pending"
**Solution:** Check order update logic
- Ensure `order.paymentStatus = 'completed'` is saved
- Verify order status changes to "confirmed"
- Check database for updated values

---

## 📊 Database Schema

### Payment Model
```javascript
{
  orderId: ObjectId,
  userId: ObjectId,
  amount: Number,
  method: 'upi' | 'card' | 'netbanking' | 'wallet' | 'cod',
  gateway: 'razorpay' | 'stripe',
  transactionId: String,  // Razorpay order_id
  status: 'pending' | 'success' | 'failed' | 'refunded',
  gatewayResponse: Object
}
```

### Order Model Updates
```javascript
{
  paymentMethod: 'upi' | 'card' | 'cod',
  paymentStatus: 'pending' | 'completed' | 'failed',
  status: 'pending' | 'confirmed' | 'preparing' | ...
}
```

---

## 🚀 Going Live

### 1. Get Live Credentials
- Login to [Razorpay Dashboard](https://dashboard.razorpay.com/)
- Complete KYC verification
- Generate Live API keys

### 2. Update Environment Variables
```env
# Backend .env
RAZORPAY_KEY_ID=rzp_live_xxxxx
RAZORPAY_KEY_SECRET=xxxxx

# Frontend .env
VITE_RAZORPAY_KEY_ID=rzp_live_xxxxx
```

### 3. Enable Payment Methods
- Configure payment methods in Razorpay dashboard
- Set up settlement account
- Configure webhook URLs (optional)

### 4. Test in Production
- Test with real payments (₹1 test)
- Verify webhooks work
- Check settlement reports

---

## 📝 API Endpoints

### Create Razorpay Order
```
POST /api/payments/razorpay/create-order
Authorization: Bearer <token>

Request:
{
  "orderId": "order_id_from_db",
  "amount": 500.00
}

Response:
{
  "success": true,
  "message": "Razorpay order created",
  "data": {
    "orderId": "order_xxx",
    "amount": 50000,
    "currency": "INR",
    "paymentId": "payment_record_id"
  }
}
```

### Verify Payment
```
POST /api/payments/verify
Authorization: Bearer <token>

Request:
{
  "paymentId": "payment_record_id",
  "gateway": "razorpay",
  "gatewayResponse": {
    "razorpay_payment_id": "pay_xxx",
    "razorpay_order_id": "order_xxx",
    "razorpay_signature": "signature_xxx"
  }
}

Response:
{
  "success": true,
  "message": "Payment verified successfully",
  "data": {
    "payment": { ... }
  }
}
```

---

## ✨ Features Implemented

- ✅ Real-time payment processing
- ✅ Multiple payment methods (UPI, Card)
- ✅ Secure signature verification
- ✅ Payment status tracking
- ✅ Order confirmation on payment success
- ✅ Payment failure handling
- ✅ Payment cancellation handling
- ✅ User-friendly payment modal
- ✅ Automatic order status updates
- ✅ Payment method display in order details
- ✅ Warning badges for pending payments

---

## 🎉 Success!

Razorpay is now fully integrated! Users can:
1. ✅ Pay with UPI (PhonePe, Google Pay, Paytm, etc.)
2. ✅ Pay with Cards (Visa, Mastercard, Amex, RuPay)
3. ✅ Pay Cash on Delivery
4. ✅ See payment status in real-time
5. ✅ Get order confirmation after payment

Restaurant owners can:
1. ✅ See payment status for each order
2. ✅ Know which orders are paid vs pending
3. ✅ Process only confirmed paid orders

---

## 📞 Support

For Razorpay integration issues:
- [Razorpay Docs](https://razorpay.com/docs/)
- [Razorpay Support](https://razorpay.com/support/)
- [Test Credentials](https://razorpay.com/docs/payments/payments/test-card-details/)

For FlashBites issues:
- Check console logs in browser (F12)
- Check backend server logs
- Verify environment variables are set
- Test with Razorpay test credentials first
