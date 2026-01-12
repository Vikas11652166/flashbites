require('dotenv').config();
const { Resend } = require('resend');

console.log('🔍 Testing Resend Configuration...\n');

// Check environment variables
console.log('RESEND_API_KEY:', process.env.RESEND_API_KEY ? '✅ Set' : '❌ Missing');
console.log('');

if (!process.env.RESEND_API_KEY) {
  console.error('❌ RESEND_API_KEY is missing!');
  process.exit(1);
}

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);
console.log('✅ Resend initialized\n');

// Test email
const testEmail = process.argv[2] || 'vermarohit7839@gmail.com';
const otp = Math.floor(100000 + Math.random() * 900000).toString();

console.log(`📧 Sending test OTP to: ${testEmail}`);
console.log(`🔐 OTP: ${otp}\n`);

(async () => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'FlashBites <onboarding@resend.dev>',
      to: [testEmail],
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
    });

    if (error) {
      console.error('❌ Error sending email:');
      console.error(JSON.stringify(error, null, 2));
      process.exit(1);
    }

    console.log('✅ Email sent successfully!');
    console.log('📬 Check your inbox at:', testEmail);
    console.log('📧 Email ID:', data.id);
    console.log('');
    console.log('✅ Resend is working correctly!');
    console.log('🚀 Ready for production deployment!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
})();
