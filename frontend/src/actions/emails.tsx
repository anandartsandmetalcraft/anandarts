"use server";

import React from "react";
import { Resend } from "resend";
import { renderToBuffer } from "@react-pdf/renderer";
import { InvoicePDF } from "@/lib/invoices";
import { db } from "@/lib/db";
import { logActivity } from "@/actions/activity";
import { revalidatePath } from "next/cache";
import { generateInvoiceNumber, getInvoiceChannel } from "@/lib/invoiceNumbers";

/**
 * Email & Invoice Automation Actions
 * ────────────────────────────────────────────────────────────────
 * Invoice Numbering:
 * - Store pickup orders → AAS001, AAS002, AAS003...
 * - Website/shipping orders → AAW001, AAW002, AAW003...
 * ────────────────────────────────────────────────────────────────
 */

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendInvoiceEmail(orderId: string) {
  try {
    // --- Step 1: Fetch Order Details ---
    const order = await db.order.findUnique({
      where: { id: orderId },
      include: {
        items: true,
        address: true,
        user: { select: { email: true, firstName: true } },
        invoice: true,
      },
    });

    if (!order || !order.user.email) return { error: "Order not found or no email" };

    // --- Step 2: Determine invoice number ---
    // If an invoice already exists for this order, reuse its number.
    // Otherwise, generate a new sequential number.
    let invoiceNumber: string;
    const channel = getInvoiceChannel(order);

    if (order.invoice) {
      invoiceNumber = order.invoice.invoiceNumber;
    } else {
      invoiceNumber = await generateInvoiceNumber(channel);
    }

    // --- Step 3: Render PDF to Buffer ---
    const orderWithInvoice = { ...order, invoiceNumber };
    // @ts-ignore - React-PDF types can be tricky in Server Actions
    const pdfBuffer = await renderToBuffer(React.createElement(InvoicePDF, { order: orderWithInvoice }));

    // --- Step 4: Send Email via Resend ---
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "Anand Arts <orders@anandarts.in>",
      to: [order.user.email],
      subject: `Invoice ${invoiceNumber} for Order ${order.orderNumber} - Anand Arts`,
      html: `
        <div style="font-family: serif; color: #2f4f4f; padding: 20px;">
          <h1 style="color: #8b0000; border-bottom: 2px solid #b8860b; padding-bottom: 10px;">ANAND ARTS & METAL CRAFT</h1>
          <p>Pranam, ${order.user.firstName || "Customer"}.</p>
          <p>Your sanctuary curation is now confirmed. We have received your payment for order <strong>${order.orderNumber}</strong>.</p>
          <p>Your invoice number is <strong>${invoiceNumber}</strong>. Please find your official tax invoice attached for your records.</p>
          <p>We are now preparing your heritage artifacts for shipment from our Srirampura studio. You will receive a tracking link shortly.</p>
          <br/>
          <p>Warm regards,<br/>The Anand Arts Team</p>
        </div>
      `,
      attachments: [
        {
          filename: `${invoiceNumber}.pdf`,
          content: pdfBuffer,
        },
      ],
    });

    if (error) throw new Error(error.message);

    // --- Step 5: Record Invoice Generation ---
    await db.invoice.upsert({
      where: { orderId },
      update: { emailSentAt: new Date() },
      create: {
        orderId,
        invoiceNumber,
        channel,
        emailSentAt: new Date(),
      },
    });

    void logActivity({
      type: "INVOICE_CREATED",
      title: "Invoice generated",
      description: `Invoice ${invoiceNumber} created for order ${order.orderNumber}.`,
      href: `/admin/invoices/${orderId}`,
      referenceId: orderId,
      metadata: {
        orderNumber: order.orderNumber,
        invoiceNumber,
        channel,
      },
    });

    void logActivity({
      type: "INVOICE_SENT",
      title: "Invoice emailed",
      description: `Invoice ${invoiceNumber} for order ${order.orderNumber} was emailed to ${order.user.email}.`,
      href: `/admin/invoices/${orderId}`,
      referenceId: orderId,
      metadata: {
        orderNumber: order.orderNumber,
        invoiceNumber,
        email: order.user.email,
        channel,
      },
    });

    revalidatePath("/account");
    revalidatePath("/admin/invoices");
    revalidatePath("/admin/orders");
    revalidatePath("/admin/activity");

    return { success: true, data, invoiceNumber };
  } catch (error: any) {
    console.error("Email / Invoice Automation Error:", error.message);
    return { error: error.message };
  }
}
