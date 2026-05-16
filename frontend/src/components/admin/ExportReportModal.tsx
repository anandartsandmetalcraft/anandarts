"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, FileText, FileSpreadsheet, Download, Loader2,
  CheckCircle2, Calendar, ShieldCheck, Building2,
  BarChart3, Map, Package, AlertCircle,
} from "lucide-react";
import { getFinancialReportData, type ReportPeriod } from "@/actions/reports";
import { downloadReportAsExcel } from "@/lib/reportExcel";

// ── Types ──────────────────────────────────────────────────────────
type Format = "EXCEL" | "PDF";

interface Props {
  open: boolean;
  onClose: () => void;
}

// ── Static config ──────────────────────────────────────────────────
const PERIODS: { value: ReportPeriod; label: string; sub: string }[] = [
  { value: "1M",  label: "1 Month",   sub: "Last 30 days"    },
  { value: "3M",  label: "3 Months",  sub: "Last quarter"    },
  { value: "6M",  label: "6 Months",  sub: "Half yearly"     },
  { value: "12M", label: "12 Months", sub: "Full fiscal year" },
];

const WHAT_IS_INCLUDED = [
  { icon: BarChart3,   label: "Revenue Summary",          sub: "Gross, net, AOV, discounts" },
  { icon: ShieldCheck, label: "GST Breakdown",             sub: "CGST / SGST / IGST split" },
  { icon: FileText,    label: "Full Transaction Ledger",   sub: "GSTR-1 compatible rows" },
  { icon: Package,     label: "HSN Code Analysis",         sub: "Product-wise HSN summary" },
  { icon: Map,         label: "State-wise Distribution",   sub: "Intra vs inter-state" },
  { icon: Building2,   label: "B2B GSTIN Records",         sub: "Corporate buyer details" },
  { icon: Calendar,    label: "Line-item Detail",          sub: "Per-order item breakdown" },
];

// ── Component ──────────────────────────────────────────────────────
export default function ExportReportModal({ open, onClose }: Props) {
  const [period, setPeriod]   = useState<ReportPeriod>("3M");
  const [format, setFormat]   = useState<Format>("EXCEL");
  const [step, setStep]       = useState<"select" | "generating" | "done" | "error">("select");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleGenerate() {
    setStep("generating");
    setErrorMsg("");

    try {
      const result = await getFinancialReportData(period);

      if ("error" in result) {
        setErrorMsg(result.error ?? "Failed to generate report.");
        setStep("error");
        return;
      }

      if (format === "EXCEL") {
        downloadReportAsExcel(result);
        setStep("done");
      } else {
        // Dynamic import to avoid SSR + large bundle on non-admin pages
        const { pdf } = await import("@react-pdf/renderer");
        const { ReportDocument } = await import("@/components/admin/ReportDocument");

        const blob  = await pdf(<ReportDocument report={result} />).toBlob();
        const url   = URL.createObjectURL(blob);
        const link  = document.createElement("a");
        const dateStr = new Date().toISOString().slice(0, 10);
        link.href     = url;
        link.download = `AnandArts_Financial_${period}_${dateStr}.pdf`;
        link.click();
        URL.revokeObjectURL(url);
        setStep("done");
      }
    } catch (err: unknown) {
      console.error("[ExportModal] generation error:", err);
      setErrorMsg("Something went wrong. Please try again.");
      setStep("error");
    }
  }

  function handleClose() {
    onClose();
    setTimeout(() => setStep("select"), 300);
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          >
            <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-[32px] bg-white shadow-2xl">

              {/* ── Header ── */}
              <div className="sticky top-0 z-10 bg-[#0F172A] rounded-t-[32px] px-8 pt-8 pb-6">
                <button
                  onClick={handleClose}
                  aria-label="Close export modal"
                  className="absolute top-6 right-6 h-8 w-8 flex items-center justify-center rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors"
                >
                  <X size={16} />
                </button>
                <p className="font-ui text-[10px] font-bold uppercase tracking-[0.3em] text-[#D4AF37] mb-2">
                  Admin · Financial Reports
                </p>
                <h2 className="font-display text-2xl font-bold text-white leading-tight">
                  Export Revenue Report
                </h2>
                <p className="mt-2 text-sm text-slate-400 font-ui">
                  GST-compliant financial data for your CA / audit filing.
                </p>
              </div>

              <div className="p-8 space-y-8">

                {/* ── Step: Generating ── */}
                {step === "generating" && (
                  <div className="flex flex-col items-center justify-center py-12 gap-4">
                    <Loader2 size={40} className="text-[#D4AF37] animate-spin" />
                    <p className="font-display text-xl font-bold text-[#0F172A]">Compiling Report…</p>
                    <p className="text-sm text-slate-500 font-ui">Fetching orders, computing GST split, building sheets.</p>
                  </div>
                )}

                {/* ── Step: Done ── */}
                {step === "done" && (
                  <div className="flex flex-col items-center justify-center py-12 gap-4">
                    <CheckCircle2 size={48} className="text-emerald-500" />
                    <p className="font-display text-xl font-bold text-[#0F172A]">Report Downloaded!</p>
                    <p className="text-sm text-slate-500 font-ui">Check your downloads folder.</p>
                    <button
                      onClick={() => setStep("select")}
                      className="mt-4 rounded-xl border border-slate-200 px-6 py-2.5 font-ui text-xs font-bold uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all"
                    >
                      Export Another
                    </button>
                  </div>
                )}

                {/* ── Step: Error ── */}
                {step === "error" && (
                  <div className="flex flex-col items-center justify-center py-12 gap-4">
                    <AlertCircle size={48} className="text-rose-500" />
                    <p className="font-display text-xl font-bold text-[#0F172A]">Export Failed</p>
                    <p className="text-sm text-rose-500 font-ui">{errorMsg}</p>
                    <button
                      onClick={() => setStep("select")}
                      className="mt-4 rounded-xl border border-slate-200 px-6 py-2.5 font-ui text-xs font-bold uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all"
                    >
                      Try Again
                    </button>
                  </div>
                )}

                {/* ── Step: Select ── */}
                {step === "select" && (
                  <>
                    {/* Period */}
                    <div>
                      <p className="font-ui text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-3">
                        Select Period
                      </p>
                      <div className="grid grid-cols-4 gap-3">
                        {PERIODS.map((p) => (
                          <button
                            key={p.value}
                            onClick={() => setPeriod(p.value)}
                            className={`rounded-2xl border-2 p-4 text-left transition-all ${
                              period === p.value
                                ? "border-[#0F172A] bg-[#0F172A] text-white"
                                : "border-slate-200 bg-white hover:border-slate-300"
                            }`}
                          >
                            <p className={`font-ui text-xs font-bold uppercase tracking-wider ${period === p.value ? "text-[#D4AF37]" : "text-slate-400"}`}>
                              {p.value}
                            </p>
                            <p className={`font-display text-base font-bold mt-1 ${period === p.value ? "text-white" : "text-[#0F172A]"}`}>
                              {p.label}
                            </p>
                            <p className={`font-ui text-[10px] mt-0.5 ${period === p.value ? "text-slate-400" : "text-slate-400"}`}>
                              {p.sub}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Format */}
                    <div>
                      <p className="font-ui text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-3">
                        Export Format
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        {/* Excel */}
                        <button
                          onClick={() => setFormat("EXCEL")}
                          className={`rounded-2xl border-2 p-5 text-left transition-all group ${
                            format === "EXCEL"
                              ? "border-emerald-500 bg-emerald-50"
                              : "border-slate-200 bg-white hover:border-slate-300"
                          }`}
                        >
                          <div className={`h-12 w-12 rounded-xl flex items-center justify-center mb-3 transition-colors ${format === "EXCEL" ? "bg-emerald-500" : "bg-slate-100 group-hover:bg-slate-200"}`}>
                            <FileSpreadsheet size={24} className={format === "EXCEL" ? "text-white" : "text-slate-500"} />
                          </div>
                          <p className={`font-display text-base font-bold ${format === "EXCEL" ? "text-emerald-800" : "text-[#0F172A]"}`}>
                            Excel (.xlsx)
                          </p>
                          <p className="font-ui text-[11px] text-slate-500 mt-1 leading-relaxed">
                            5 sheets: Summary, Ledger, Line Items, HSN, State-wise. Best for CA filing.
                          </p>
                        </button>

                        {/* PDF */}
                        <button
                          onClick={() => setFormat("PDF")}
                          className={`rounded-2xl border-2 p-5 text-left transition-all group ${
                            format === "PDF"
                              ? "border-[#D4AF37] bg-amber-50"
                              : "border-slate-200 bg-white hover:border-slate-300"
                          }`}
                        >
                          <div className={`h-12 w-12 rounded-xl flex items-center justify-center mb-3 transition-colors ${format === "PDF" ? "bg-[#D4AF37]" : "bg-slate-100 group-hover:bg-slate-200"}`}>
                            <FileText size={24} className={format === "PDF" ? "text-white" : "text-slate-500"} />
                          </div>
                          <p className={`font-display text-base font-bold ${format === "PDF" ? "text-amber-900" : "text-[#0F172A]"}`}>
                            PDF Report
                          </p>
                          <p className="font-ui text-[11px] text-slate-500 mt-1 leading-relaxed">
                            Formatted audit report with GST summary page + landscape transaction ledger.
                          </p>
                        </button>
                      </div>
                    </div>

                    {/* What's included */}
                    <div>
                      <p className="font-ui text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-3">
                        What's Included
                      </p>
                      <div className="rounded-2xl border border-slate-100 bg-slate-50/60 divide-y divide-slate-100">
                        {WHAT_IS_INCLUDED.map(({ icon: Icon, label, sub }) => (
                          <div key={label} className="flex items-center gap-4 px-5 py-3.5">
                            <div className="h-8 w-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center flex-shrink-0">
                              <Icon size={14} className="text-[#0F172A]" />
                            </div>
                            <div>
                              <p className="font-ui text-xs font-bold text-[#0F172A]">{label}</p>
                              <p className="font-ui text-[10px] text-slate-400 mt-0.5">{sub}</p>
                            </div>
                            <CheckCircle2 size={14} className="text-emerald-500 ml-auto flex-shrink-0" />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Auditor note */}
                    <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 flex gap-3">
                      <ShieldCheck size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-ui text-xs font-bold text-amber-900">GST Filing Note</p>
                        <p className="font-ui text-[11px] text-amber-700 mt-1 leading-relaxed">
                          CGST/SGST applies to deliveries within Karnataka. IGST applies to all other states.
                          HSN summary follows GSTR-1 Table 12 format. Verify GSTIN and HSN codes with your CA before filing.
                        </p>
                      </div>
                    </div>

                    {/* Generate button */}
                    <button
                      onClick={handleGenerate}
                      className="w-full flex items-center justify-center gap-3 rounded-2xl bg-[#0F172A] px-8 py-5 font-ui text-[11px] font-bold uppercase tracking-[0.2em] text-white hover:bg-[#1E293B] active:scale-[0.99] transition-all shadow-lg"
                    >
                      <Download size={16} />
                      Generate &amp; Download {format === "EXCEL" ? "Excel" : "PDF"} · {PERIODS.find(p => p.value === period)?.label}
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
