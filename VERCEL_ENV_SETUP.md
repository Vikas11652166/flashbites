# Vercel Environment Variables Setup

## 🚨 CRITICAL: Your login is failing because environment variables are not set in Vercel!

## Steps to Fix:

### 1. Go to Vercel Dashboard
Visit: https://vercel.com/amanazads/flashbites (or your project URL)

### 2. Navigate to Settings
- Click on your project "flashbites"
- Go to **Settings** tab
- Click on **Environment Variables** in the sidebar

### 3. Add the Following Environment Variable

**Required for login to work:**

```
Name: VITE_API_URL
Value: https://flashbites-backend.up.railway.app/api
Environment: Production, Preview, Development (select all)
```

### 4. Optional Environment Variables (add if using these features)

```
Name: VITE_GOOGLE_MAPS_API_KEY
Value: your_actual_google_maps_key
Environment: Production, Preview, Development

Name: VITE_RAZORPAY_KEY_ID
Value: your_actual_razorpay_key (if using payments)
Environment: Production, Preview, Development

Name: VITE_STRIPE_PUBLISHABLE_KEY
Value: your_actual_stripe_key (if using payments)
Environment: Production, Preview, Development
```

### 5. Redeploy
After adding environment variables:
- Click **Deployments** tab
- Click the three dots (...) on the latest deployment
- Click **Redeploy**

OR the changes will automatically apply on your next git push.

## Why This Happened

The frontend code uses `import.meta.env.VITE_API_URL` which defaults to `http://localhost:8080/api` when not set.

In production, without this environment variable, your frontend tries to call localhost (which doesn't exist in the browser), causing login failures.

## Verification

After setting the variable and redeploying, check your browser console:
1. Open https://flashbites.vercel.app/login
2. Open Developer Tools (F12)
3. Go to Network tab
4. Try to login
5. You should see API calls going to `https://flashbites-backend.up.railway.app/api/auth/login` instead of localhost

## Quick Access Links

- Vercel Dashboard: https://vercel.com/dashboard
- Your Project Settings: https://vercel.com/amanazads/flashbites/settings/environment-variables
- Railway Backend: https://flashbites-backend.up.railway.app/api

---

**After fixing this, your login will work! 🎉**
