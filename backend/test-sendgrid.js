require('dotenv').config();
const sgMail = require('@sendgrid/mail');

console.log('🔍 Testing SendGrid Configuration...\n');

// Check environment variables
console.log('SENDGRID_API_KEY:', process.env.SENDGRID_API_KEY ? '✅ Set' : '❌ Missing');
console.log('SENDGRID_FROM_EMAIL:', process.env.SENDGRID_FROM_EMAIL || '❌ Missing');
console.log('');

if (!process.env.SENDGRID_API_KEY) {
  console.error('❌ SENDGRID_API_KEY is missing!');
  process.exit(1);
}

if (!process.env.SENDGRID_FROM_EMAIL) {
  console.error('❌ SENDGRID_FROM_EMAIL is missing!');
  process.exit(1);
}

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
console.log('✅ SendGrid initialized\n');

// Test email
const testEmail = process.argv[2] || 'vermarohit7839@gmail.com';
const otp = Math.floor(100000 + Math.random() * 900000).toString();

console.log(`📧 Sending test OTP to: ${testEmail}`);
console.log(`🔐 OTP: ${otp}\n`);

const msg = {
  to: testEmail,
  from: process.env.SENDGRID_FROM_EMAIL,
  subject: 'FlashBites - Test OTP',
  html: `
    <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #f97316; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0;">FlashBites</h1>
      </div>
      <div style="background-color: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
        <h2 style="color: #333;">OTP Verification Test</h2>
        <p style="color: #666; font-size: 16px;">Your test OTP is:</p>
        <div style="background-color: white; padding: 20px; text-align: center; margin: 20px 0; border-radius: 5px; border: 2px dashed #f97316;">
          <span style="font-size: 32px; font-weight: bold; color: #f97316; letter-spacing: 5px;">${otp}</span>
        </div>
        <p style="color: #999; font-size: 14px;">This is a test email from FlashBites.</p>
        <p style="color: #999; font-size: 14px;">Domain: https://flashbites.shop</p>
      </div>
    </div>
  `
};

// Send email
sgMail.send(msg)
  .then(() => {
    console.log('✅ Email sent successfully!');
    console.log('📬 Check your inbox at:', testEmail);
    console.log('');
    console.log('✅ SendGrid is working correctly!');
    console.log('🚀 Ready for production deployment!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error sending email:');
    if (error.response) {
      console.error('Status:', error.response.statusCode);
      console.error('Body:', JSON.stringify(error.response.body, null, 2));
    } else {
      console.error(error.message);
    }
    console.log('');
    console.log('📋 Troubleshooting:');
    console.log('1. Verify sender email in SendGrid dashboard');
    console.log('2. Check API key permissions (Mail Send)');
    console.log('3. Make sure from email matches verified sender');
    process.exit(1);
  });
