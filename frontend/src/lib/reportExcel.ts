import * as XLSX from "xlsx";
import type { FinancialReportData } from "@/actions/reports";

// ── Helpers ───────────────────────────────────────────────────────
const inr = (paise: number) =>
  (paise / 100).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

// ── Header style helper ────────────────────────────────────────────
function headerRow(values: string[]) {
  return values; // xlsx community edition doesn't support cell styles in writeFile, keep plain
}

// ── Sheet builders ─────────────────────────────────────────────────

function buildSummarySheet(report: FinancialReportData) {
  const { meta, summary } = report;
  const rows = [
    ["ANAND ARTS & METAL CRAFT — GST AUDIT REPORT"],
    [],
    ["Business Name",  meta.businessName],
    ["GSTIN",          meta.originGstin],
    ["Origin State",   meta.businessState],
    ["Report Period",  meta.periodLabel],
    ["From Date",      fmt(meta.from)],
    ["To Date",        fmt(meta.to)],
    ["Generated At",   fmt(meta.generatedAt)],
    [],
    ["── GST LIABILITY SUMMARY (INR) ────────────────"],
    ["Total Invoices",                   summary.totalOrders],
    ["Gross Sales (Incl. GST)",          inr(summary.totalRevenuePaise)],
    ["Total Taxable Value",              inr(summary.totalTaxablePaise)],
    ["Total GST Liability",              inr(summary.totalTaxPaise)],
    [],
    ["── TAX BREAKDOWN ──────────────────────────────"],
    ["CGST Collected (9%)",              inr(summary.totalCgstPaise)],
    ["SGST Collected (9%)",              inr(summary.totalSgstPaise)],
    ["IGST Collected (18%)",             inr(summary.totalIgstPaise)],
    [],
    ["── OTHER CHARGES ──────────────────────────────"],
    ["Total Discounts",                  inr(summary.totalDiscountPaise)],
    ["Total Shipping Revenue",           inr(summary.totalShippingPaise)],
  ];
  return XLSX.utils.aoa_to_sheet(rows);
}

function buildTransactionSheet(report: FinancialReportData, type: "B2B" | "B2C") {
  const headers = headerRow([
    "Invoice No.", "Date", "Customer Name", "Customer GSTIN", "Company Name",
    "Delivery State", "GST Type", "Taxable Value (₹)", 
    "CGST (₹)", "SGST (₹)", "IGST (₹)", "Total Tax (₹)", "Invoice Total (₹)",
    "Payment Method", "HSN/Items",
  ]);

  const filtered = report.transactions.filter(t => 
    type === "B2B" ? t.gstinCustomer : !t.gstinCustomer
  );

  const rows = filtered.map((t) => [
    t.invoiceNumber,
    fmt(t.date),
    t.customerName,
    t.gstinCustomer || "—",
    t.companyName || "—",
    t.deliveryState,
    t.isIntraState ? "Intra-state (CGST+SGST)" : "Inter-state (IGST)",
    inr(t.subtotalPaise),
    inr(t.cgstPaise),
    inr(t.sgstPaise),
    inr(t.igstPaise),
    inr(t.taxPaise),
    inr(t.totalPaise),
    t.paymentMethod,
    t.items.map((i) => `${i.name} [${i.hsnCode}]`).join("; "),
  ]);

  return XLSX.utils.aoa_to_sheet([headers, ...rows]);
}

function buildHsnSheet(report: FinancialReportData) {
  const headers = headerRow([
    "HSN Code", "Description", "UQC", "Total Qty Sold",
    "Total Taxable Value (₹)", "GST Rate",
    "Total Tax (₹)", "CGST (₹)", "SGST (₹)", "IGST (₹)",
  ]);

  const rows = report.hsnBreakdown.map((h) => {
    const cgst = Math.round(h.taxPaise / 2);
    const sgst = h.taxPaise - cgst;
    return [
      h.hsn,
      "Metal Crafts / Statues",
      "PCS",
      h.qty,
      inr(h.taxablePaise),
      "18%",
      inr(h.taxPaise),
      inr(cgst),
      inr(sgst),
      inr(0),
    ];
  });

  return XLSX.utils.aoa_to_sheet([headers, ...rows]);
}

function buildStateSheet(report: FinancialReportData) {
  const headers = headerRow([
    "Place of Supply (State)", "Invoice Count",
    "Taxable Value (₹)", "Total Tax (₹)",
    "Supply Type",
  ]);

  const rows = report.stateBreakdown
    .sort((a, b) => b.revenuePaise - a.revenuePaise)
    .map((s) => [
      s.state,
      s.orders,
      inr(s.revenuePaise - s.taxPaise),
      inr(s.taxPaise),
      s.isIntra ? "Intra-state" : "Inter-state",
    ]);

  return XLSX.utils.aoa_to_sheet([headers, ...rows]);
}

// ── Main export function ───────────────────────────────────────────
export function downloadReportAsExcel(report: FinancialReportData) {
  const wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(wb, buildSummarySheet(report),            "Audit Summary");
  XLSX.utils.book_append_sheet(wb, buildTransactionSheet(report, "B2B"), "B2B Sales");
  XLSX.utils.book_append_sheet(wb, buildTransactionSheet(report, "B2C"), "B2C Sales");
  XLSX.utils.book_append_sheet(wb, buildHsnSheet(report),                "HSN Summary");
  XLSX.utils.book_append_sheet(wb, buildStateSheet(report),              "State Distribution");

  const periodLabel = report.meta.periodLabel.replace(/\s+/g, "_");
  const dateStr = new Date().toISOString().slice(0, 10);
  const filename = `AnandArts_Financial_${periodLabel}_${dateStr}.xlsx`;

  XLSX.writeFile(wb, filename);
}
