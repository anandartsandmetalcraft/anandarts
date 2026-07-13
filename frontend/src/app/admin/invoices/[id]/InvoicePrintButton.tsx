"use client";

import { Printer } from "lucide-react";

export default function InvoicePrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="flex items-center gap-2 px-6 py-3 bg-[#0BB197] text-white rounded-[6px] text-[11px] font-bold uppercase tracking-widest hover:brightness-110 shadow-sm transition-all shadow-[#0BB197]/10 border border-transparent"
    >
      <Printer size={16} /> Print Invoice
    </button>
  );
}
