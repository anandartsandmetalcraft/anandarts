import { Resend } from "resend";
import { generateOrderConfirmationEmail } from "./emailTemplates";

// Ensure RESEND_API_KEY is available in production
const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy_key");

export async function sendOrderConfirmationEmail(
  toEmail: string,
  orderData: Parameters<typeof generateOrderConfirmationEmail>[0]
) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY is not set. Email not sent.");
    return { success: false, error: "Missing Resend API Key" };
  }

  try {
    const html = generateOrderConfirmationEmail(orderData);

    const fromEmail = process.env.NODE_ENV === "production" 
      ? "Anand Arts <orders@anandarts.com>" 
      : "Anand Arts <onboarding@resend.dev>";

    const data = await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      subject: `Order Confirmed: ${orderData.orderNumber}`,
      html: html,
    });

    if (data.error) {
      console.error("Resend Error:", data.error);
      return { success: false, error: data.error.message };
    }

    return { success: true, id: data.data?.id };
  } catch (error: any) {
    console.error("Failed to send order confirmation email:", error);
    return { success: false, error: error.message };
  }
}
