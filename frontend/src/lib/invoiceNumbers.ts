import { db } from "@/lib/db";

/**
 * Invoice Number Generator — Sequential Series
 * ────────────────────────────────────────────────────────────────
 * Store (in-person) invoices:  AAS001, AAS002, AAS003...
 * Website (online) invoices:   AAW001, AAW002, AAW003...
 *
 * Uses atomic DB counter (InvoiceCounter table) to guarantee
 * sequential, collision-free invoice numbers.
 * ────────────────────────────────────────────────────────────────
 */

export type InvoiceChannel = "STORE" | "WEBSITE";

const PREFIXES: Record<InvoiceChannel, string> = {
  STORE: "AAS",
  WEBSITE: "AAW",
};

/**
 * Atomically generates the next invoice number for a given channel.
 * Uses upsert + increment to prevent race conditions.
 *
 * @returns e.g. "AAS001" or "AAW042"
 */
export async function generateInvoiceNumber(channel: InvoiceChannel): Promise<string> {
  const prefix = PREFIXES[channel];

  // Atomic increment — upserts if the counter row doesn't exist yet
  const counter = await db.invoiceCounter.upsert({
    where: { id: channel },
    update: { counter: { increment: 1 } },
    create: { id: channel, counter: 1 },
  });

  // Pad to 3 digits minimum (AAS001, AAW001). 
  // For > 999 invoices, it naturally grows (AAS1000, etc.)
  const paddedNumber = String(counter.counter).padStart(3, "0");

  return `${prefix}${paddedNumber}`;
}

/**
 * Determines the invoice channel based on order data.
 * Store pickup orders get "AAS" prefix, all others get "AAW".
 */
export function getInvoiceChannel(order: { notes?: string | null }): InvoiceChannel {
  return order.notes === "STORE_PICKUP" ? "STORE" : "WEBSITE";
}
