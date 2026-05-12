import { BrevoClient } from "@getbrevo/brevo";

const brevo = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY,
});

export const sendOTPEmail = async (email, username, otp) => {
  try {
    const response = await brevo.transactionalEmails.sendTransacEmail({
      sender: {
        email: "noreply@grubdev.top",
        name: "grubDev",
      },
      to: [
        {
          email,
        },
      ],

      subject: "Password Reset OTP",

      htmlContent: `
        <!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Password Reset OTP</title>
  <!--[if (gte mso 9)|(IE)]>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  <![endif]-->
  <style>
    /* Client-safe responsive resets */
    * {
      margin: 0;
      padding: 0;
      border: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Helvetica, Arial, sans-serif;
      line-height: 1.5;
    }
    img, a {
      border: 0;
      text-decoration: none;
    }
    .ExternalClass, .ReadMsgBody {
      width: 100%;
      background-color: #F4F7FC;
    }
    body, table, td, p, a {
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    table, td {
      border-collapse: collapse;
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }
    @media only screen and (max-width: 600px) {
      .responsive-table {
        width: 100% !important;
      }
      .inner-padding {
        padding: 28px 24px !important;
      }
      .otp-code {
        font-size: 38px !important;
        letter-spacing: 4px !important;
      }
      .button-cell {
        padding: 0 20px 20px 20px !important;
      }
      .footer-text {
        text-align: center !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #EFF3F8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">

  <!-- MAIN EMAIL CONTAINER (Centered, max-width 600px) -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0" align="center" bgcolor="#EFF3F8" style="background-color: #EFF3F8; width: 100%;">
    <tr>
      <td align="center" style="padding: 32px 20px;">
        <!-- CARD WRAPPER (background white, rounded corners, soft shadow) -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" align="center" style="max-width: 560px; width: 100%; background-color: #FFFFFF; border-radius: 28px; box-shadow: 0 12px 28px rgba(0,0,0,0.08); overflow: hidden; border: 1px solid #EAEFF4;">
          <!-- HERO / BRAND HEADER -->
          <tr>
            <td style="background: linear-gradient(135deg, #1E2A3A 0%, #0F1722 100%); padding: 28px 32px 20px 32px; border-bottom: 1px solid #2D3A4B;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="left" style="color: #FFFFFF;">
                    <span style="font-size: 24px; font-weight: 700; letter-spacing: -0.3px;">🔐 Secure<span style="font-weight: 400;">Access</span></span>
                    <p style="color: #B0C4DE; font-size: 14px; margin-top: 6px; margin-bottom: 0;">Identity </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- MAIN CONTENT AREA -->
          <tr>
            <td class="inner-padding" style="padding: 36px 36px 28px 36px;">
              <!-- Greeting & reset context -->
              <h1 style="font-size: 26px; font-weight: 700; color: #121826; margin: 0 0 8px 0; letter-spacing: -0.2px;">Password reset request</h1>
              <p style="font-size: 16px; color: #3A4859; margin: 0 0 24px 0; line-height: 1.5;">
                We received a request to reset the password for your account. Use the secure one-time code below to verify your identity and continue.
              </p>

              <!-- OTP BLOCK - High visibility + preserved original semantics (Your OTP is: + OTP + expiry) -->
              <div style="background-color: #F9FBFE; border-radius: 24px; border: 1px solid #E5EDF5; padding: 28px 20px; margin: 12px 0 20px 0; text-align: center;">
                <p style="font-size: 15px; font-weight: 500; color: #2C3E66; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 10px 0;">Your verification OTP</p>
                <!-- OTP displayed exactly as variable, matching original structure -->
                <h2 style="margin: 8px 0 12px 0; font-family: 'Courier New', 'SF Mono', 'JetBrains Mono', monospace; font-size: 48px; font-weight: 800; letter-spacing: 6px; color: #0B1E33; background: #FFFFFF; display: inline-block; padding: 10px 28px; border-radius: 60px; box-shadow: 0 2px 6px rgba(0,0,0,0.03); border: 1px solid #E2E9F2;">${otp}</h2>
                <!-- Expiry message as originally required -->
                <p style="font-size: 14px; color: #D9534F; background: #FFF5F5; display: inline-block; padding: 6px 16px; border-radius: 50px; margin: 16px 0 0 0; font-weight: 500;">
                  ⏱️ This OTP will expire in <strong>5 minutes</strong>
                </p>
                <!-- additional security note (adds real-world feel) -->
                <p style="font-size: 13px; color: #5D6F88; margin: 18px 0 0 0; border-top: 1px solid #E4ECF5; padding-top: 14px;">
                  For security, never share this code with anyone.
                </p>
              </div>

              <!-- Instruction: what to do next with the OTP -->
              <div style="margin: 20px 0 18px 0;">
                <p style="font-size: 15px; color: #2C3E50; margin: 0 0 12px 0;">
                  ✨ <strong>How to reset your password</strong>
                </p>
                <ul style="margin: 0 0 20px 20px; padding: 0; color: #3E5775; font-size: 14px;">
                  <li style="margin-bottom: 8px;">Enter this OTP on the password reset page</li>
                  <li style="margin-bottom: 8px;">Create a new strong password</li>
                  <li>You'll regain access to your account instantly</li>
                </ul>
              </div>

              

              
            </td>
          </tr>

          
        </table>

        
      </td>
     </tr>
   </table>
</body>
</html>
      `,
    });
  } catch (error) {
    throw new Error(error.message);
  }
};
