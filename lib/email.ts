import nodemailer from "nodemailer";

// Create email transporter
// Supports Gmail, Outlook, or any SMTP provider
export const createEmailTransporter = () => {
  // For development, you can use Gmail with app password
  // For production, use a service like SendGrid, Mailgun, etc.

  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn("Email configuration missing. Emails will not be sent.");
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

// Email templates
export const emailTemplates = {
  subscriptionSuccess: (data: {
    userName: string;
    plan: string;
    price: string;
    nextBillingDate: string;
  }) => ({
    subject: "Welcome to CourseMind Pro! 🎉",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
            .feature-list { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
            .feature-list li { margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to CourseMind Pro!</h1>
              <p>Your subscription is now active</p>
            </div>
            <div class="content">
              <p>Hi ${data.userName},</p>

              <p>Thank you for subscribing to <strong>${data.plan}</strong>! Your payment of <strong>${data.price}</strong> has been processed successfully.</p>

              <div class="feature-list">
                <h3>What's included in your Pro plan:</h3>
                <ul>
                  <li>✨ 50 AI-generated courses per month</li>
                  <li>🤖 Advanced AI tutor for personalized help</li>
                  <li>📝 Interactive quizzes with instant feedback</li>
                  <li>🎓 Course completion certificates</li>
                  <li>📺 YouTube video integration</li>
                  <li>📚 Advanced note-taking tools</li>
                  <li>🔗 Course sharing capabilities</li>
                  <li>⚡ Priority support</li>
                </ul>
              </div>

              <p><strong>Next billing date:</strong> ${data.nextBillingDate}</p>

              <div style="text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/create" class="button">Create Your First Course</a>
              </div>

              <p>If you have any questions or need assistance, feel free to reply to this email or visit our support center.</p>

              <p>Happy learning!<br>The CourseMind Team</p>
            </div>
            <div class="footer">
              <p>You're receiving this email because you subscribed to CourseMind Pro.</p>
              <p>Manage your subscription in your <a href="${process.env.NEXT_PUBLIC_APP_URL}/profile/billing">billing settings</a>.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Hi ${data.userName},

Welcome to CourseMind Pro!

Thank you for subscribing to ${data.plan}. Your payment of ${data.price} has been processed successfully.

What's included in your Pro plan:
- 50 AI-generated courses per month
- Advanced AI tutor for personalized help
- Interactive quizzes with instant feedback
- Course completion certificates
- YouTube video integration
- Advanced note-taking tools
- Course sharing capabilities
- Priority support

Next billing date: ${data.nextBillingDate}

Get started: ${process.env.NEXT_PUBLIC_APP_URL}/dashboard/create

If you have any questions, feel free to reply to this email.

Happy learning!
The CourseMind Team
    `.trim(),
  }),

  subscriptionCanceled: (data: {
    userName: string;
    plan: string;
    endDate: string;
  }) => ({
    subject: "Your CourseMind Subscription Has Been Canceled",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #f3f4f6; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Subscription Canceled</h1>
            </div>
            <div class="content">
              <p>Hi ${data.userName},</p>

              <p>We're sorry to see you go! Your <strong>${data.plan}</strong> subscription has been canceled.</p>

              <p>You'll continue to have access to all Pro features until <strong>${data.endDate}</strong>. After that, your account will revert to the Free plan.</p>

              <p><strong>What happens next:</strong></p>
              <ul>
                <li>Pro features remain active until ${data.endDate}</li>
                <li>After that, you'll have the Free plan (3 courses)</li>
                <li>All your existing courses will be preserved</li>
                <li>You can resubscribe anytime</li>
              </ul>

              <div style="text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/profile/billing" class="button">Manage Subscription</a>
              </div>

              <p>We'd love to hear your feedback! Reply to this email and let us know how we can improve.</p>

              <p>Thank you for using CourseMind!<br>The CourseMind Team</p>
            </div>
            <div class="footer">
              <p>Questions? Contact us at <a href="mailto:support@coursemind.com">support@coursemind.com</a></p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Hi ${data.userName},

We're sorry to see you go! Your ${data.plan} subscription has been canceled.

You'll continue to have access to all Pro features until ${data.endDate}. After that, your account will revert to the Free plan.

What happens next:
- Pro features remain active until ${data.endDate}
- After that, you'll have the Free plan (3 courses)
- All your existing courses will be preserved
- You can resubscribe anytime

Manage your subscription: ${process.env.NEXT_PUBLIC_APP_URL}/profile/billing

We'd love to hear your feedback! Reply to this email and let us know how we can improve.

Thank you for using CourseMind!
The CourseMind Team
    `.trim(),
  }),

  contactForm: (data: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }) => ({
    subject: `Contact Form: ${data.subject}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #667eea; color: white; padding: 20px; border-radius: 5px 5px 0 0; }
            .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; }
            .field { margin: 15px 0; }
            .label { font-weight: bold; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>New Contact Form Submission</h2>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">From:</div>
                <div>${data.name} (${data.email})</div>
              </div>
              <div class="field">
                <div class="label">Subject:</div>
                <div>${data.subject}</div>
              </div>
              <div class="field">
                <div class="label">Message:</div>
                <div>${data.message}</div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
New Contact Form Submission

From: ${data.name} (${data.email})
Subject: ${data.subject}

Message:
${data.message}
    `.trim(),
  }),
};

// Send email function
export async function sendEmail(options: {
  to: string;
  subject: string;
  html: string;
  text: string;
}) {
  const transporter = createEmailTransporter();

  if (!transporter) {
    console.warn("Email transporter not configured. Skipping email send.");
    return { success: false, error: "Email not configured" };
  }

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to send email:", error);
    return { success: false, error: "Failed to send email" };
  }
}
