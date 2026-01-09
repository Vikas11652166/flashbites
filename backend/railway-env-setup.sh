#!/bin/bash

# Railway Environment Setup Script
# Run this to set environment variables in Railway

echo "Setting Railway environment variables..."

railway variables set NODE_ENV=production
railway variables set PORT=5000

# You need to update these with your actual values
echo "⚠️  Update the following commands with your actual values:"
echo ""
echo "railway variables set MONGODB_URI='your_mongodb_uri'"
echo "railway variables set JWT_SECRET='your_jwt_secret'"
echo "railway variables set JWT_REFRESH_SECRET='your_refresh_secret'"
echo "railway variables set RAZORPAY_KEY_ID='your_razorpay_key'"
echo "railway variables set RAZORPAY_KEY_SECRET='your_razorpay_secret'"
echo "railway variables set CLOUDINARY_CLOUD_NAME='your_cloudinary_name'"
echo "railway variables set CLOUDINARY_API_KEY='your_cloudinary_key'"
echo "railway variables set CLOUDINARY_API_SECRET='your_cloudinary_secret'"
echo "railway variables set FRONTEND_URL='https://your-frontend.vercel.app'"
echo ""
echo "Optional:"
echo "railway variables set GOOGLE_CLIENT_ID='your_google_id'"
echo "railway variables set GOOGLE_CLIENT_SECRET='your_google_secret'"
