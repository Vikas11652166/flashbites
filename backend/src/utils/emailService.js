const Mailjet = require('node-mailjet');

// Initialize Mailjet with API keys
let mailjet = null;
if (process.env.MAILJET_API_KEY && process.env.MAILJET_SECRET_KEY) {
  mailjet = Mailjet.apiConnect(
    process.env.MAILJET_API_KEY,
    process.env.MAILJET_SECRET_KEY
  );
  console.log('✅ Mailjet initialized successfully');
} else {
  console.warn('⚠️ Mailjet API keys not configured');
}

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP email using Mailjet
const sendOTPEmail = async (email, otp, purpose = 'verification') => {
  // Always log OTP for development/debugging
  console.log(`📧 Sending OTP to ${email}: ${otp} (${purpose})`);
  
  try {
    // Check if Mailjet is configured
    if (!mailjet) {
      console.warn('⚠️ Mailjet not configured. OTP logged above.');
      return true;
    }

    const subject = purpose === 'verification' 
      ? 'FlashBites - Email Verification OTP'
      : 'FlashBites - Password Reset OTP';
    
    const message = purpose === 'verification'
      ? `Your OTP for email verification is: <b>${otp}</b>. This OTP will expire in 10 minutes.`
      : `Your OTP for password reset is: <b>${otp}</b>. This OTP will expire in 10 minutes.`;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #f97316; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0;">FlashBites</h1>
        </div>
        <div style="background-color: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333;">OTP Verification</h2>
          <p style="color: #666; font-size: 16px;">${message}</p>
          <div style="background-color: white; padding: 20px; text-align: center; margin: 20px 0; border-radius: 5px; border: 2px dashed #f97316;">
            <span style="font-size: 32px; font-weight: bold; color: #f97316; letter-spacing: 5px;">${otp}</span>
          </div>
          <p style="color: #999; font-size: 14px;">If you didn't request this OTP, please ignore this email.</p>
          <p style="color: #999; font-size: 14px;">This is an automated email, please do not reply.</p>
        </div>
      </div>
    `;

    console.log('📨 Using Mailjet API...');
    
    const request = mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: process.env.MAILJET_FROM_EMAIL || 'noreply@flashbites.shop',
            Name: 'FlashBites'
          },
          To: [
            {
              Email: email
            }
          ],
          Subject: subject,
          HTMLPart: htmlContent
        }
      ]
    });

    const result = await request;
    console.log(`✅ Email sent to ${email} via Mailjet. Status: ${result.body.Messages[0].Status}`);
    return true;
    
  } catch (error) {
    console.error('❌ Email error:', error.message);
    if (error.response) {
      console.error('Response:', JSON.stringify(error.response.data));
    }
    console.log(`📧 OTP for ${email}: ${otp} - Check Railway logs`);
    return true; // Still return true to not block user flow
  }
};

// Send welcome email
const sendWelcomeEmail = async (email, name) => {
  try {
    if (!mailjet) {
      console.warn('⚠️ Mailjet not configured, skipping welcome email');
      return true;
    }

    const request = mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: process.env.MAILJET_FROM_EMAIL || 'noreply@flashbites.shop',
            Name: 'FlashBites'
          },
          To: [
            {
              Email: email
            }
          ],
          Subject: 'Welcome to FlashBites!',
          HTMLPart: `
            <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
              <div style="background-color: #f97316; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="color: white; margin: 0;">Welcome to FlashBites!</h1>
              </div>
              <div style="background-color: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
                <h2 style="color: #333;">Hello ${name}!</h2>
                <p style="color: #666; font-size: 16px;">Thank you for joining FlashBites. We're excited to have you on board!</p>
                <p style="color: #666; font-size: 16px;">Start exploring delicious food from the best restaurants near you.</p>
                <div style="text-align: center; margin: 30px 0;">
                  <a href="https://flashbites.shop" 
                     style="background-color: #f97316; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                    Start Ordering
                  </a>
                </div>
                <p style="color: #999; font-size: 14px; text-align: center;">Happy eating! 🍕🍔🍜</p>
              </div>
            </div>
          `
        }
      ]
    });

    await request;
    console.log(`✅ Welcome email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('Welcome email error:', error);
    return false;
  }
};

// Send password reset success email
const sendPasswordResetSuccessEmail = async (email, name) => {
  try {
    if (!mailjet) {
      console.warn('⚠️ Mailjet not configured, skipping password reset email');
      return true;
    }

    const request = mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: process.env.MAILJET_FROM_EMAIL || 'noreply@flashbites.shop',
            Name: 'FlashBites'
          },
          To: [
            {
              Email: email
            }
          ],
          Subject: 'Password Reset Successful',
          HTMLPart: `
            <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
              <div style="background-color: #10b981; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="color: white; margin: 0;">Password Reset Successful</h1>
              </div>
              <div style="background-color: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
                <h2 style="color: #333;">Hello ${name}!</h2>
                <p style="color: #666; font-size: 16px;">Your password has been successfully reset.</p>
                <p style="color: #666; font-size: 16px;">You can now log in with your new password.</p>
                <p style="color: #dc2626; font-size: 14px; margin-top: 20px;">If you didn't make this change, please contact our support team immediately.</p>
              </div>
            </div>
          `
        }
      ]
    });

    await request;
    console.log(`✅ Password reset email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('Password reset success email error:', error);
    return false;
  }
};

module.exports = {
  generateOTP,
  sendOTPEmail,
  sendWelcomeEmail,
  sendPasswordResetSuccessEmail
};
