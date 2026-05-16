"use client";

import React from "react";
import { IndianRupee, ShieldCheck, Building2, Map } from "lucide-react";

function formatINRPaise(valuePaise: number) {
  return `₹ ${(valuePaise / 100).toLocaleString("en-IN")}`;
}

export function FinancialOverview(props: {
  grossRevenuePaise: number;
  taxableValuePaise: number;
  cgstPaise: number;
  sgstPaise: number;
  igstPaise: number;
}) {
  const { grossRevenuePaise, taxableValuePaise, cgstPaise, sgstPaise, igstPaise } = props;

  const cards = [
    {
      title: "Gross Revenue",
      subtitle: "Total Sales (Incl. GST)",
      value: formatINRPaise(grossRevenuePaise),
      icon: IndianRupee,
      tone: "bg-slate-50 text-slate-700 border-slate-200",
    },
    {
      title: "Taxable Value",
      subtitle: "Base Value (Excl. GST)",
      value: formatINRPaise(taxableValuePaise),
      icon: Building2,
      tone: "bg-blue-50 text-blue-700 border-blue-200",
    },
    {
      title: "CGST / SGST",
      subtitle: "Intra-state (Karnataka)",
      value: formatINRPaise(cgstPaise + sgstPaise),
      icon: ShieldCheck,
      tone: "bg-emerald-50 text-emerald-800 border-emerald-200",
    },
    {
      title: "IGST Collected",
      subtitle: "Inter-state Sales",
      value: formatINRPaise(igstPaise),
      icon: Map,
      tone: "bg-amber-50 text-amber-700 border-amber-200",
    },
  ] as const;

  return (
    <div className="rounded-[40px] border border-slate-200 bg-white p-8 shadow-sm">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="font-display text-2xl font-bold text-[#0F172A]">GST Compliance Audit</h3>
          <p className="text-sm text-slate-500 mt-1">Real-time tax liability tracking for GSTR-1 & GSTR-3B filing.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-50 border border-emerald-100">
           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
           <span className="font-ui text-[10px] font-bold uppercase tracking-widest text-emerald-700">Audit-Ready State</span>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.title}
            className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm group hover:border-[#0F172A] transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="font-ui text-[10px] font-bold uppercase tracking-widest text-slate-400">{card.title}</p>
                <p className="font-display text-2xl font-bold text-[#0F172A]">{card.value}</p>
                <p className="text-xs text-slate-500">{card.subtitle}</p>
              </div>
              <div className={`h-12 w-12 rounded-2xl border flex items-center justify-center transition-colors group-hover:bg-[#0F172A] group-hover:text-white ${card.tone}`}>
                <card.icon size={22} strokeWidth={1.5} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

