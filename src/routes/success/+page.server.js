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
    const email = formData.get("email");
    const collaboratorCode = formData.get("collaboratorCode");

    // Validate required fields
    if (!email || !collaboratorCode) {
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

    // Basic collaborator code validation (alphanumeric, typically 12+ characters)
    const codeStr = collaboratorCode.toString().trim();
    if (codeStr.length < 6) {
      return fail(400, {
        error: "Please enter a valid Shopify collaborator code.",
      });
    }

    const apiKey = env.RESEND_API_KEY;
    if (!apiKey) {
      return fail(500, {
        error: "Failed to submit information. Please try again later.",
      });
    }

    const resend = new Resend(apiKey);

    // Get the from email and to email from environment variables
    const fromEmail =
      env.CONTACT_FROM_EMAIL || "Success Form <onboarding@resend.dev>";
    const toEmail =
      env.CONTACT_TO_EMAIL ||
      env.AUDIT_TO_INTERNAL_EMAIL ||
      "contact@example.com";

    try {
      // Escape user input to prevent XSS
      const safeEmail = escapeHtml(email);
      const safeCode = escapeHtml(collaboratorCode);

      // Send email to the site owner
      const emailResponse = await resend.emails.send({
        from: fromEmail,
        to: toEmail,
        replyTo: email.toString(),
        subject: `New Payment Success - Collaborator Code Received`,
        html: `
          <h2>New Payment Success Submission</h2>
          <p>A customer has completed their payment and submitted their Shopify collaborator code.</p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;" />
          <p><strong>Email:</strong> ${safeEmail}</p>
          <p><strong>Shopify Collaborator Code:</strong> <code style="background: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-family: monospace;">${safeCode}</code></p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;" />
          <p style="color: #6b7280; font-size: 14px;">This customer has completed their Stripe payment and is ready to get started.</p>
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
          subject: `We've received your collaborator code`,
          html: `
            <h2>Thank you for your purchase!</h2>
            <p>Hi there,</p>
            <p>We've successfully received your Shopify collaborator code and will be in touch soon to get started with your catalog cleanup.</p>
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;" />
            <p><strong>Email:</strong> ${safeEmail}</p>
            <p><strong>Collaborator Code:</strong> <code style="background: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-family: monospace;">${safeCode}</code></p>
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;" />
            <p>We'll review your store and reach out within 1-2 business days to begin the implementation process.</p>
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
        error: "Failed to submit information. Please try again later.",
      });
    }
  },
};
