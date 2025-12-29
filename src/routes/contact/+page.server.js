import { Resend } from "resend";
import { env } from "$env/dynamic/private";
import { fail } from "@sveltejs/kit";

// Simple HTML escape function to prevent XSS
function escapeHtml(text) {
  if (!text) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/** @type {import('./$types').Actions} */
export const actions = {
  default: async ({ request }) => {
    const formData = await request.formData();
    const name = formData.get("name");
    const email = formData.get("email");
    const subject = formData.get("subject");
    const message = formData.get("message");

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return fail(400, {
        error:
          "All fields are required. Please fill in all fields and try again.",
      });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.toString())) {
      return fail(400, {
        error: "Please enter a valid email address.",
      });
    }

    const apiKey = env.RESEND_API_KEY;
    if (!apiKey) {
      return fail(500, {
        error: "Failed to send message. Please try again later.",
      });
    }

    const resend = new Resend(apiKey);

    // Get the from email and to email from environment variables
    const fromEmail =
      env.CONTACT_FROM_EMAIL || "Contact Form <onboarding@resend.dev>";
    const toEmail =
      env.CONTACT_TO_EMAIL ||
      env.AUDIT_TO_INTERNAL_EMAIL ||
      "contact@example.com";

    try {
      // Escape user input to prevent XSS
      const safeName = escapeHtml(name);
      const safeEmail = escapeHtml(email);
      const safeSubject = escapeHtml(subject);
      const safeMessage = escapeHtml(message).replace(/\n/g, "<br>");

      // Send email to the site owner
      const emailResponse = await resend.emails.send({
        from: fromEmail,
        to: toEmail,
        replyTo: email.toString(),
        subject: `Contact Form: ${subject}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          <p><strong>Subject:</strong> ${safeSubject}</p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;" />
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap;">${safeMessage}</p>
        `,
      });

      if (emailResponse.error) {
        throw new Error(emailResponse.error.message || "Failed to send email");
      }

      // Optionally send a confirmation email to the user
      if (env.CONTACT_SEND_CONFIRMATION !== "false") {
        const confirmationResponse = await resend.emails.send({
          from: fromEmail,
          to: email.toString(),
          subject: `We received your message: ${subject}`,
          html: `
            <h2>Thank you for reaching out!</h2>
            <p>Hi ${safeName},</p>
            <p>We've received your message and will get back to you as soon as possible, typically within 24 hours during business days.</p>
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;" />
            <p><strong>Your message:</strong></p>
            <p style="white-space: pre-wrap;">${safeMessage}</p>
            <p style="margin-top: 20px;">Best regards,<br />The Team</p>
          `,
        });

        if (confirmationResponse.error) {
          // Silently fail - the main email was sent
        }
      }

      return {
        success: true,
      };
    } catch (error) {
      return fail(500, {
        error: "Failed to send message. Please try again later.",
      });
    }
  },
};
