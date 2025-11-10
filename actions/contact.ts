"use server";

import { z } from "zod";
import { sendEmail, emailTemplates } from "@/lib/email";
import { db } from "@/lib/db";

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export async function submitContactForm(formData: FormData) {
  try {
    const validated = contactFormSchema.parse({
      name: formData.get("name"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    });

    // Split name into first and last name
    const nameParts = validated.name.trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    // Save to database
    try {
      await db.contact.create({
        data: {
          firstName,
          lastName,
          email: validated.email,
          message: `Subject: ${validated.subject}\n\n${validated.message}`,
        },
      });
    } catch (dbError) {
      console.error("Failed to save contact submission:", dbError);
      // Continue with email sending even if database save fails
    }

    // Send email notification to admin
    const email = emailTemplates.contactForm({
      name: validated.name,
      email: validated.email,
      subject: validated.subject,
      message: validated.message,
    });

    // Send to admin email (configure in .env)
    const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;

    if (!adminEmail) {
      console.error("Admin email not configured");
      return { error: "Contact form is not configured. Please try again later." };
    }

    const result = await sendEmail({
      to: adminEmail,
      subject: email.subject,
      html: email.html,
      text: email.text,
    });

    if (!result.success) {
      return { error: "Failed to send message. Please try again." };
    }

    // Optionally, send a confirmation email to the user
    try {
      await sendEmail({
        to: validated.email,
        subject: "We received your message - CourseMind",
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>Thank You for Contacting Us!</h1>
                </div>
                <div class="content">
                  <p>Hi ${validated.name},</p>

                  <p>We've received your message and will get back to you as soon as possible, typically within 24 hours during business days.</p>

                  <p><strong>Your message:</strong></p>
                  <p style="background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #667eea;">
                    ${validated.message}
                  </p>

                  <p>If you have any urgent questions, feel free to reach out to us at <a href="mailto:support@coursemind.com">support@coursemind.com</a>.</p>

                  <p>Best regards,<br>The CourseMind Team</p>
                </div>
                <div class="footer">
                  <p>&copy; 2025 CourseMind. All rights reserved.</p>
                </div>
              </div>
            </body>
          </html>
        `,
        text: `
Hi ${validated.name},

We've received your message and will get back to you as soon as possible, typically within 24 hours during business days.

Your message:
${validated.message}

If you have any urgent questions, feel free to reach out to us at support@coursemind.com.

Best regards,
The CourseMind Team

© 2025 CourseMind. All rights reserved.
        `.trim(),
      });
    } catch (error) {
      // Don't fail if confirmation email fails
      console.error("Failed to send confirmation email:", error);
    }

    return { success: true };
  } catch (error) {
    console.error("Error submitting contact form:", error);

    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }

    return { error: "Failed to send message. Please try again." };
  }
}
