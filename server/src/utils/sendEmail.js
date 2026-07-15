const { google } = require("googleapis");

const getGmailService = async () => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
    "https://developers.google.com/oauthplayground",
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.GMAIL_REFRESH_TOKEN,
  });

  return google.gmail({ version: "v1", auth: oauth2Client });
};

const encodeEmail = (to, subject, htmlContent) => {
  const encodedSubject = `=?UTF-8?B?${Buffer.from(subject).toString("base64")}?=`;

  const emailLines = [
    `From: "VendorMart" <${process.env.EMAIL_ADDRESS}>`,
    `To: ${to}`,
    `Content-Type: text/html; charset=utf-8`,
    `MIME-Version: 1.0`,
    `Subject: ${encodedSubject}`,
    ``,
    htmlContent,
  ];

  return Buffer.from(emailLines.join("\n"))
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
};

const sendEmail = async (to, subject, htmlContent) => {
  try {
    const gmail = await getGmailService();
    const encodedEmail = encodeEmail(to, subject, htmlContent);

    await gmail.users.messages.send({
      userId: "me",
      requestBody: { raw: encodedEmail },
    });

    console.log("Email sent successfully! ✅");
    return true;
  } catch (error) {
    console.log("Email error:", error.message);
    return false;
  }
};

// OTP Email Template
const sendOTPEmail = async (to, otp, type) => {
  const isRegister = type === "register";
  const subject = isRegister
    ? "Verify Your VendorMart Account"
    : "Reset Your VendorMart Password";

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="500" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background: #6366f1; padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px;">VendorMart</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 15px;">
                ${isRegister ? "Verify your account" : "Reset your password"}
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 30px; text-align: center;">
              <p style="color: #333333; font-size: 16px; margin: 0 0 20px;">
                ${
                  isRegister
                    ? "Thank you for registering! Please use the OTP below to verify your account."
                    : "We received a request to reset your password. Use the OTP below."
                }
              </p>

              <!-- OTP Box -->
              <div style="background-color: #f3f4f6; border-radius: 12px; padding: 24px; margin: 20px 0;">
                <p style="color: #666666; font-size: 14px; margin: 0 0 8px;">Your OTP is:</p>
                <p style="color: #6366f1; font-size: 42px; font-weight: bold; letter-spacing: 8px; margin: 0; font-family: monospace;">
                  ${otp}
                </p>
                <p style="color: #999999; font-size: 13px; margin: 12px 0 0;">
                  This OTP expires in 10 minutes
                </p>
              </div>

              <p style="color: #999999; font-size: 13px; margin: 20px 0 0;">
                If you didn't request this, please ignore this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #999999; font-size: 12px; margin: 0;">
                VendorMart - Multi Vendor E-Commerce Platform
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  return sendEmail(to, subject, htmlContent);
};

module.exports = { sendEmail, sendOTPEmail };
