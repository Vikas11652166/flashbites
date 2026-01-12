require('dotenv').config();
const Mailjet = require('node-mailjet');

console.log('🔍 Testing Mailjet Configuration...\n');

// Check environment variables
console.log('MAILJET_API_KEY:', process.env.MAILJET_API_KEY ? '✅ Set' : '❌ Missing');
console.log('MAILJET_SECRET_KEY:', process.env.MAILJET_SECRET_KEY ? '✅ Set' : '❌ Missing');
console.log('MAILJET_FROM_EMAIL:', process.env.MAILJET_FROM_EMAIL || 'noreply@flashbites.shop');
console.log('');

if (!process.env.MAILJET_API_KEY || !process.env.MAILJET_SECRET_KEY) {
  console.error('❌ Mailjet API keys are missing!');
  console.log('\n📋 Setup Instructions:');
  console.log('1. Go to https://www.mailjet.com/ and sign up');
  console.log('2. Navigate to Account Settings → REST API');
  console.log('3. Copy your API Key and Secret Key');
  console.log('4. Add them to your .env file:');
  console.log('   MAILJET_API_KEY=your_api_key');
  console.log('   MAILJET_SECRET_KEY=your_secret_key');
  process.exit(1);
}

// Initialize Mailjet
const mailjet = Mailjet.apiConnect(
  process.env.MAILJET_API_KEY,
  process.env.MAILJET_SECRET_KEY
);
console.log('✅ Mailjet initialized\n');

// Test email
const testEmail = process.argv[2] || 'vermarohit7839@gmail.com';
const otp = Math.floor(100000 + Math.random() * 900000).toString();

console.log(`📧 Sending test OTP to: ${testEmail}`);
console.log(`🔐 OTP: ${otp}\n`);

(async () => {
  try {
    const request = mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: process.env.MAILJET_FROM_EMAIL || 'noreply@flashbites.shop',
            Name: 'FlashBites'
          },
          To: [
            {
              Email: testEmail
            }
          ],
          Subject: 'FlashBites - Test OTP',
          HTMLPart: `
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
                <p style="color: #999; font-size: 14px;">Domain: <a href="https://flashbites.shop">https://flashbites.shop</a></p>
              </div>
            </div>
          `
        }
      ]
    });

    const result = await request;
    
    console.log('✅ Email sent successfully!');
    console.log('📬 Check your inbox at:', testEmail);
    console.log('📧 Status:', result.body.Messages[0].Status);
    console.log('📊 Message ID:', result.body.Messages[0].To[0].MessageID);
    console.log('');
    console.log('✅ Mailjet is working correctly!');
    console.log('🚀 Ready for production deployment!');
    console.log('');
    console.log('📋 Next Steps:');
    console.log('1. Add MAILJET_API_KEY to Railway');
    console.log('2. Add MAILJET_SECRET_KEY to Railway');
    console.log('3. Add MAILJET_FROM_EMAIL to Railway');
    console.log('4. Push code and deploy');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error sending email:');
    console.error('Status:', error.statusCode);
    console.error('Message:', error.message);
    if (error.response && error.response.data) {
      console.error('Details:', JSON.stringify(error.response.data, null, 2));
    }
    process.exit(1);
  }
})();
