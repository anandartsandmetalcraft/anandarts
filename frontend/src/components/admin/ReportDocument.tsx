import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import type { FinancialReportData } from "@/actions/reports";

// ── Helpers ───────────────────────────────────────────────────────
const inr = (paise: number) =>
  `₹ ${(paise / 100).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

// ── Styles ────────────────────────────────────────────────────────
const S = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 8,
    color: "#1A1A2E",
    paddingHorizontal: 32,
    paddingVertical: 28,
    backgroundColor: "#FFFFFF",
  },
  // Cover / Header
  coverBand: {
    backgroundColor: "#0F172A",
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  coverTitle: { color: "#FFFFFF", fontSize: 18, fontFamily: "Helvetica-Bold" },
  coverSub: { color: "#D4AF37", fontSize: 8, marginTop: 4 },
  coverMeta: { color: "#94A3B8", fontSize: 7, textAlign: "right" },
  // Section header
  sectionTitle: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#0F172A",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    paddingBottom: 4,
    marginBottom: 8,
    marginTop: 16,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  // Summary cards row
  cardRow: { flexDirection: "row", gap: 8, marginBottom: 12 },
  card: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 10,
  },
  cardLabel: { fontSize: 6, color: "#64748B", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 4 },
  cardValue: { fontSize: 12, fontFamily: "Helvetica-Bold", color: "#0F172A" },
  cardSub: { fontSize: 6, color: "#94A3B8", marginTop: 2 },
  // GST band
  gstRow: { flexDirection: "row", gap: 8, marginBottom: 12 },
  gstCard: {
    flex: 1,
    borderRadius: 6,
    padding: 10,
  },
  gstCardBlue: { backgroundColor: "#EFF6FF", borderWidth: 1, borderColor: "#BFDBFE" },
  gstCardGreen: { backgroundColor: "#F0FDF4", borderWidth: 1, borderColor: "#BBF7D0" },
  gstCardAmber: { backgroundColor: "#FFFBEB", borderWidth: 1, borderColor: "#FDE68A" },
  // Table
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#0F172A",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 5,
    marginBottom: 2,
  },
  tableHeaderCell: {
    color: "#FFFFFF",
    fontSize: 6,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: "row",
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  tableRowAlt: { backgroundColor: "#F8FAFC" },
  tableCell: { fontSize: 7, color: "#334155" },
  tableCellBold: { fontFamily: "Helvetica-Bold", color: "#0F172A" },
  // Footer
  footer: {
    position: "absolute",
    bottom: 16,
    left: 32,
    right: 32,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    paddingTop: 6,
  },
  footerText: { fontSize: 6, color: "#94A3B8" },
  pageNumber: { fontSize: 6, color: "#94A3B8" },
});

// ── Sub-components ─────────────────────────────────────────────────

function CoverHeader({ meta }: { meta: FinancialReportData["meta"] }) {
  return (
    <View style={S.coverBand}>
      <View>
        <Text style={S.coverTitle}>GST Audit Report</Text>
        <Text style={S.coverSub}>{meta.businessName}  ·  GSTIN: {meta.originGstin}</Text>
      </View>
      <View>
        <Text style={S.coverMeta}>{meta.periodLabel}</Text>
        <Text style={S.coverMeta}>{fmtDate(meta.from)} – {fmtDate(meta.to)}</Text>
        <Text style={S.coverMeta}>Generated: {fmtDate(meta.generatedAt)}</Text>
      </View>
    </View>
  );
}

function SummaryPage({ report }: { report: FinancialReportData }) {
  const { summary } = report;
  return (
    <Page size="A4" style={S.page}>
      <CoverHeader meta={report.meta} />

      <Text style={S.sectionTitle}>GST Liability Summary</Text>
      <View style={S.cardRow}>
        <View style={S.card}>
          <Text style={S.cardLabel}>Total Invoices</Text>
          <Text style={S.cardValue}>{summary.totalOrders}</Text>
          <Text style={S.cardSub}>Audit period total</Text>
        </View>
        <View style={S.card}>
          <Text style={S.cardLabel}>Gross Sales</Text>
          <Text style={S.cardValue}>{inr(summary.totalRevenuePaise)}</Text>
          <Text style={S.cardSub}>Including GST</Text>
        </View>
        <View style={S.card}>
          <Text style={S.cardLabel}>Taxable Value</Text>
          <Text style={S.cardValue}>{inr(summary.totalTaxablePaise)}</Text>
          <Text style={S.cardSub}>Excluding GST</Text>
        </View>
        <View style={S.card}>
          <Text style={S.cardLabel}>Total GST</Text>
          <Text style={S.cardValue}>{inr(summary.totalTaxPaise)}</Text>
          <Text style={S.cardSub}>Tax Collected</Text>
        </View>
      </View>

      <Text style={S.sectionTitle}>Tax Breakdown (Rate: 18%)</Text>
      <View style={S.gstRow}>
        <View style={[S.gstCard, S.gstCardBlue]}>
          <Text style={S.cardLabel}>CGST Collected (9%)</Text>
          <Text style={{ ...S.cardValue, color: "#1D4ED8" }}>{inr(summary.totalCgstPaise)}</Text>
          <Text style={S.cardSub}>Intra-state sales</Text>
        </View>
        <View style={[S.gstCard, S.gstCardGreen]}>
          <Text style={S.cardLabel}>SGST Collected (9%)</Text>
          <Text style={{ ...S.cardValue, color: "#15803D" }}>{inr(summary.totalSgstPaise)}</Text>
          <Text style={S.cardSub}>Intra-state sales</Text>
        </View>
        <View style={[S.gstCard, S.gstCardAmber]}>
          <Text style={S.cardLabel}>IGST Collected (18%)</Text>
          <Text style={{ ...S.cardValue, color: "#B45309" }}>{inr(summary.totalIgstPaise)}</Text>
          <Text style={S.cardSub}>Inter-state sales</Text>
        </View>
      </View>

      <Text style={S.sectionTitle}>Place of Supply (State Distribution)</Text>
      <View style={S.tableHeader}>
        <Text style={[S.tableHeaderCell, { flex: 2 }]}>State</Text>
        <Text style={[S.tableHeaderCell, { flex: 1 }]}>Invoices</Text>
        <Text style={[S.tableHeaderCell, { flex: 2 }]}>Taxable Value</Text>
        <Text style={[S.tableHeaderCell, { flex: 2 }]}>GST Collected</Text>
        <Text style={[S.tableHeaderCell, { flex: 1.5 }]}>Supply Type</Text>
      </View>
      {report.stateBreakdown
        .sort((a, b) => b.revenuePaise - a.revenuePaise)
        .slice(0, 15)
        .map((s, i) => (
          <View key={s.state} style={[S.tableRow, i % 2 === 1 ? S.tableRowAlt : {}]}>
            <Text style={[S.tableCell, { flex: 2 }]}>{s.state}</Text>
            <Text style={[S.tableCell, { flex: 1 }]}>{s.orders}</Text>
            <Text style={[S.tableCell, { flex: 2 }]}>{inr(s.revenuePaise - s.taxPaise)}</Text>
            <Text style={[S.tableCell, { flex: 2 }]}>{inr(s.taxPaise)}</Text>
            <Text style={[S.tableCell, { flex: 1.5 }]}>
              {s.isIntra ? "Intra-state" : "Inter-state"}
            </Text>
          </View>
        ))}

      <View style={S.footer} fixed>
        <Text style={S.footerText}>
          {report.meta.businessName}  ·  GST Audit Report  ·  Confidential
        </Text>
        <Text style={S.pageNumber} render={({ pageNumber, totalPages }) =>
          `Page ${pageNumber} of ${totalPages}`} />
      </View>
    </Page>
  );
}

function TransactionPage({ report }: { report: FinancialReportData }) {
  const chunks = [];
  const chunkSize = 25;
  for (let i = 0; i < report.transactions.length; i += chunkSize) {
    chunks.push(report.transactions.slice(i, i + chunkSize));
  }

  return (
    <>
      {chunks.map((chunk, pageIdx) => (
        <Page key={pageIdx} size="A4" orientation="landscape" style={{ ...S.page, fontSize: 7 }}>
          <CoverHeader meta={report.meta} />
          {pageIdx === 0 && <Text style={S.sectionTitle}>Transaction Ledger (GSTR-1 Style)</Text>}

          <View style={S.tableHeader}>
            {[
              ["Invoice No.", 2], ["Date", 1.5], ["Customer", 2], ["State", 1.5],
              ["Taxable (₹)", 1.5], ["CGST (₹)", 1.2], ["SGST (₹)", 1.2],
              ["IGST (₹)", 1.2], ["Total (₹)", 1.5], ["Status", 1.2],
            ].map(([label, flex]) => (
              <Text
                key={label as string}
                style={[S.tableHeaderCell, { flex: flex as number }]}
              >
                {label}
              </Text>
            ))}
          </View>

          {chunk.map((t, i) => (
            <View key={t.orderNumber} style={[S.tableRow, i % 2 === 1 ? S.tableRowAlt : {}]}>
              <Text style={[S.tableCell, S.tableCellBold, { flex: 2 }]}>{t.invoiceNumber}</Text>
              <Text style={[S.tableCell, { flex: 1.5 }]}>{fmtDate(t.date)}</Text>
              <Text style={[S.tableCell, { flex: 2 }]}>{t.customerName}</Text>
              <Text style={[S.tableCell, { flex: 1.5 }]}>{t.deliveryState}</Text>
              <Text style={[S.tableCell, { flex: 1.5 }]}>{inr(t.subtotalPaise)}</Text>
              <Text style={[S.tableCell, { flex: 1.2 }]}>{t.cgstPaise > 0 ? inr(t.cgstPaise) : "—"}</Text>
              <Text style={[S.tableCell, { flex: 1.2 }]}>{t.sgstPaise > 0 ? inr(t.sgstPaise) : "—"}</Text>
              <Text style={[S.tableCell, { flex: 1.2 }]}>{t.igstPaise > 0 ? inr(t.igstPaise) : "—"}</Text>
              <Text style={[S.tableCell, S.tableCellBold, { flex: 1.5 }]}>{inr(t.totalPaise)}</Text>
              <Text style={[S.tableCell, { flex: 1.2 }]}>{t.status}</Text>
            </View>
          ))}

          <View style={S.footer} fixed>
            <Text style={S.footerText}>
              {report.meta.businessName} · Transaction Ledger · Confidential
            </Text>
            <Text style={S.pageNumber} render={({ pageNumber, totalPages }) =>
              `Page ${pageNumber} of ${totalPages}`} />
          </View>
        </Page>
      ))}
    </>
  );
}

// ── Main Document ──────────────────────────────────────────────────
export function ReportDocument({ report }: { report: FinancialReportData }) {
  return (
    <Document
      title={`Anand Arts Financial Report — ${report.meta.periodLabel}`}
      author="Anand Arts & Metal Craft"
      subject="GST Financial Report"
    >
      <SummaryPage report={report} />
      <TransactionPage report={report} />
    </Document>
  );
}
