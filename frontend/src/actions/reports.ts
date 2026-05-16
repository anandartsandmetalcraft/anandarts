"use server";

import { db } from "@/lib/db";
import { getAdminContext } from "@/lib/adminAccess";

export type ReportPeriod = "1M" | "3M" | "6M" | "12M";

// Anand Arts origin state for CGST/SGST vs IGST determination
const ORIGIN_STATE = "karnataka";

const PERIOD_LABELS: Record<ReportPeriod, string> = {
  "1M": "Last 1 Month",
  "3M": "Last 3 Months",
  "6M": "Last 6 Months",
  "12M": "Last 12 Months",
};

function getDateRange(period: ReportPeriod): { from: Date; to: Date } {
  const to = new Date();
  const from = new Date();
  switch (period) {
    case "1M":  from.setMonth(from.getMonth() - 1);       break;
    case "3M":  from.setMonth(from.getMonth() - 3);       break;
    case "6M":  from.setMonth(from.getMonth() - 6);       break;
    case "12M": from.setFullYear(from.getFullYear() - 1); break;
  }
  from.setHours(0, 0, 0, 0);
  return { from, to };
}

export async function getFinancialReportData(period: ReportPeriod) {
  const admin = await getAdminContext();
  if (!admin.allowed) return { error: "Access Denied" };

  const { from, to } = getDateRange(period);

  try {
    const orders = await db.order.findMany({
      where: {
        createdAt: { gte: from, lte: to },
        status: {
          in: ["PAID", "CONFIRMED", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED"],
        },
      },
      orderBy: { createdAt: "asc" },
      include: {
        user: {
          select: { firstName: true, lastName: true, phone: true, email: true },
        },
        address: {
          select: { city: true, state: true, postalCode: true, country: true },
        },
        items: {
          include: {
            product: { select: { hsnCode: true, material: true } },
          },
        },
        payments: {
          select: { status: true, method: true, merchantTransactionId: true },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
        invoice: { select: { invoiceNumber: true, channel: true } },
      },
    });

    // ── Build transaction rows ──────────────────────────────────
    const transactions = orders.map((order) => {
      const isIntraState = order.address.state
        .toLowerCase()
        .includes(ORIGIN_STATE);

      const taxAmountPaise = order.tax;
      const cgstPaise = isIntraState ? Math.round(taxAmountPaise / 2) : 0;
      const sgstPaise = isIntraState ? taxAmountPaise - cgstPaise : 0;
      const igstPaise = isIntraState ? 0 : taxAmountPaise;

      return {
        invoiceNumber: order.invoice?.invoiceNumber ?? order.orderNumber,
        invoiceChannel: order.invoice?.channel ?? "WEBSITE",
        orderNumber: order.orderNumber,
        date: order.createdAt.toISOString(),
        customerName:
          `${order.user.firstName ?? ""} ${order.user.lastName ?? ""}`.trim(),
        customerEmail: order.user.email ?? "",
        customerPhone: order.user.phone ?? "",
        gstinCustomer: order.gstNumber ?? "",
        companyName: order.companyName ?? "",
        deliveryCity: order.address.city,
        deliveryState: order.address.state,
        deliveryPincode: order.address.postalCode,
        status: order.status,
        paymentMethod: order.payments[0]?.method ?? "",
        isGiftWrapped: order.isGiftWrapped,
        isIntraState,
        // Financials (all paise)
        subtotalPaise: order.subtotal,
        shippingChargePaise: order.shippingCharge,
        discountPaise: order.discount,
        giftWrapFeePaise: order.giftWrapFee,
        taxPaise: order.tax,
        totalPaise: order.total,
        // GST breakdown (paise)
        cgstPaise,
        sgstPaise,
        igstPaise,
        gstRate: 18,
        // Items
        items: order.items.map((item) => ({
          name: item.name,
          hsnCode: item.product?.hsnCode ?? "",
          quantity: item.quantity,
          unitPricePaise: item.price,
          totalPaise: item.total,
        })),
      };
    });

    // ── Summary ────────────────────────────────────────────────
    const sum = (key: keyof (typeof transactions)[0]) =>
      transactions.reduce((s, t) => s + (Number(t[key]) || 0), 0);

    const summary = {
      totalOrders: transactions.length,
      totalRevenuePaise: sum("totalPaise"),
      totalTaxablePaise: sum("subtotalPaise"),
      totalTaxPaise: sum("taxPaise"),
      totalCgstPaise: sum("cgstPaise"),
      totalSgstPaise: sum("sgstPaise"),
      totalIgstPaise: sum("igstPaise"),
      totalDiscountPaise: sum("discountPaise"),
      totalShippingPaise: sum("shippingChargePaise"),
    };

    // ── State-wise breakdown ────────────────────────────────────
    const stateMap = new Map<
      string,
      { orders: number; revenuePaise: number; taxPaise: number; isIntra: boolean }
    >();
    for (const t of transactions) {
      const state = t.deliveryState || "Unknown";
      const prev = stateMap.get(state) ?? {
        orders: 0,
        revenuePaise: 0,
        taxPaise: 0,
        isIntra: t.isIntraState,
      };
      stateMap.set(state, {
        orders: prev.orders + 1,
        revenuePaise: prev.revenuePaise + t.totalPaise,
        taxPaise: prev.taxPaise + t.taxPaise,
        isIntra: t.isIntraState,
      });
    }

    // ── HSN-wise breakdown ──────────────────────────────────────
    const hsnMap = new Map<
      string,
      { qty: number; taxablePaise: number; taxPaise: number }
    >();
    for (const t of transactions) {
      for (const item of t.items) {
        const hsn = item.hsnCode || "UNCLASSIFIED";
        const prev = hsnMap.get(hsn) ?? { qty: 0, taxablePaise: 0, taxPaise: 0 };
        const itemTax = Math.round(item.totalPaise * 0.18);
        hsnMap.set(hsn, {
          qty: prev.qty + item.quantity,
          taxablePaise: prev.taxablePaise + item.totalPaise,
          taxPaise: prev.taxPaise + itemTax,
        });
      }
    }

    return {
      success: true as const,
      meta: {
        period,
        periodLabel: PERIOD_LABELS[period],
        from: from.toISOString(),
        to: to.toISOString(),
        generatedAt: new Date().toISOString(),
        businessName: "Anand Arts & Metal Craft",
        businessState: "Karnataka",
        originGstin: process.env.BUSINESS_GSTIN ?? "29AAAAA0000A1Z5", // replace with real GSTIN
      },
      summary,
      transactions,
      stateBreakdown: Array.from(stateMap.entries()).map(([state, data]) => ({
        state,
        ...data,
      })),
      hsnBreakdown: Array.from(hsnMap.entries()).map(([hsn, data]) => ({
        hsn,
        ...data,
      })),
    };
  } catch (error: unknown) {
    console.error("[reports] getFinancialReportData error:", error);
    return { error: "Failed to generate report. Please try again." };
  }
}

export type FinancialReportData = Extract<
  Awaited<ReturnType<typeof getFinancialReportData>>,
  { success: true }
>;
