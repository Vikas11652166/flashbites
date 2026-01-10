# 🔐 VAPID Keys Setup - Push Notifications

**Generated on**: January 10, 2026

## 🔑 Your VAPID Keys

### Public Key:
```
BLtMIszEVonY2KW3DxIWZMgYPx_Myj8Zx4UYTd1ZcgvqD7f5d7EJpTx2gLFfmwXuEPjGKCPWRLFFrHGYK3n6T18
```

### Private Key:
```
weaou9AD6rcRzOv9k6dIYVIgP-cm2HTE0gtiEGcFtwA
```

---

## 📝 Railway Environment Variables Setup

Add these to your Railway backend service:

1. Go to: https://railway.app/dashboard
2. Select your **FlashBites backend** project
3. Click **Variables** tab
4. Add these variables:

```env
VAPID_PUBLIC_KEY=BLtMIszEVonY2KW3DxIWZMgYPx_Myj8Zx4UYTd1ZcgvqD7f5d7EJpTx2gLFfmwXuEPjGKCPWRLFFrHGYK3n6T18

VAPID_PRIVATE_KEY=weaou9AD6rcRzOv9k6dIYVIgP-cm2HTE0gtiEGcFtwA
```

5. Click **Deploy** (Railway will auto-redeploy with new variables)

---

## ✅ Verification

After deployment, check:

1. **Railway Logs**: Should see "Server running on port XXXX" without VAPID errors
2. **Test API**: `GET https://flashbites-backend.up.railway.app/api/notifications/vapid-public-key`
   - Should return the public key

```bash
curl https://flashbites-backend.up.railway.app/api/notifications/vapid-public-key
```

Expected Response:
```json
{
  "success": true,
  "data": {
    "publicKey": "BLtMIszEVonY2KW3DxIWZMgYPx_Myj8Zx4UYTd1ZcgvqD7f5d7EJpTx2gLFfmwXuEPjGKCPWRLFFrHGYK3n6T18"
  }
}
```

---

## 🚀 Next Steps

1. ✅ **VAPID Keys Generated**
2. ⏳ **Add to Railway** (do this now)
3. ⏳ **Wait for Deployment** (~2-3 minutes)
4. ⏳ **Test API Endpoint** (use curl command above)
5. ⏳ **Implement Frontend UI** (see NOTIFICATION_COUPON_SYSTEM.md)

---

## 🔒 Security Notes

- ⚠️ **NEVER commit these keys to Git**
- ⚠️ **Private key should only be on Railway backend**
- ✅ **Public key can be exposed to frontend**
- ✅ **Keys are already in .gitignore (environment variables)**

---

## 🎯 What This Enables

Once deployed:
- ✅ Push notifications to user browsers
- ✅ Desktop & mobile notification support
- ✅ Order status updates in real-time
- ✅ Coupon & promotional alerts
- ✅ Multi-device subscription per user

---

**Status**: Keys generated ✅ | Railway setup pending ⏳
