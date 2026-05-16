"use client";
import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { 
  FileText, 
  Search, 
  Plus, 
  ChevronDown, 
  Calendar, 
  MoreVertical, 
  Eye, 
  Edit, 
  Download, 
  Trash2, 
  Filter,
  ArrowUpRight,
  TrendingUp,
  CreditCard,
  Clock,
  XCircle,
  MoreHorizontal
} from "lucide-react";
import { getAllAdminOrders, getAdminStats } from "@/actions/admin";
import { motion, AnimatePresence } from "framer-motion";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value / 100);
}

export default function InvoiceListPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [growth, setGrowth] = useState<any>({});
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  useEffect(() => {
    async function fetch() {
      const [ordersRes, statsRes] = await Promise.all([
        getAllAdminOrders(),
        getAdminStats()
      ]);
      
      if (ordersRes.success) {
        setInvoices(ordersRes.orders!);
      }
      if (statsRes.success) {
        setGrowth(statsRes.stats.growth);
      }
      setIsLoading(false);
    }
    fetch();
  }, []);

  const stats = useMemo(() => {
    const s = {
      total: 0,
      paid: 0,
      unpaid: 0,
      cancelled: 0,
      totalCount: invoices.length,
      paidCount: 0,
      unpaidCount: 0,
      cancelledCount: 0
    };
    invoices.forEach(inv => {
      s.total += inv.total;
      if (inv.status === 'DELIVERED' || inv.status === 'SHIPPED' || inv.status === 'PAID') {
        s.paid += inv.total;
        s.paidCount++;
      } else if (inv.status === 'CANCELLED') {
        s.cancelled += inv.total;
        s.cancelledCount++;
      } else {
        s.unpaid += inv.total;
        s.unpaidCount++;
      }
    });
    return s;
  }, [invoices]);

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = inv.orderNumber.toLowerCase().includes(search.toLowerCase()) || 
                          `${inv.user.firstName} ${inv.user.lastName}`.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || (statusFilter === "Paid" && (inv.status === 'PAID' || inv.status === 'DELIVERED')) ||
                          (statusFilter === "Unpaid" && inv.status === 'PENDING') ||
                          (statusFilter === "Cancelled" && inv.status === 'CANCELLED');
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-10 min-h-screen pb-20 font-ui">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
             <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Invoices</span>
             <ChevronDown size={14} className="text-slate-300" />
             <span className="text-slate-700 font-bold uppercase tracking-widest text-[10px]">Invoice List</span>
          </div>
          <h1 className="text-3xl font-bold text-[#0F172A]">Invoices</h1>
        </div>
        <Link href="/admin/invoices/new" className="flex items-center gap-2 rounded-2xl bg-blue-500 px-8 py-4 text-[11px] font-bold uppercase tracking-widest text-white shadow-lg transition hover:bg-blue-600 active:scale-95">
           <Plus size={16} /> Create Invoice
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { 
            label: "Total Invoiced", 
            val: stats.total, 
            count: stats.totalCount, 
            icon: FileText, 
            color: growth?.invoices >= 0 ? "text-emerald-500" : "text-rose-500", 
            bg: "bg-blue-50/50", 
            border: "border-blue-100", 
            trend: `${growth?.invoices >= 0 ? "+" : ""}${growth?.invoices || 0}%` 
          },
          { 
            label: "Payments Received", 
            val: stats.paid, 
            count: stats.paidCount, 
            icon: CreditCard, 
            color: growth?.payments >= 0 ? "text-emerald-500" : "text-rose-500", 
            bg: "bg-emerald-50/50", 
            border: "border-emerald-100", 
            trend: `${growth?.payments >= 0 ? "+" : ""}${growth?.payments || 0}%` 
          },
          { 
            label: "Pending Payments", 
            val: stats.unpaid, 
            count: stats.unpaidCount, 
            icon: Clock, 
            color: "text-amber-500", 
            bg: "bg-amber-50/50", 
            border: "border-amber-100", 
            trend: "Active" 
          },
          { 
            label: "Cancelled Billing", 
            val: stats.cancelled, 
            count: stats.cancelledCount, 
            icon: XCircle, 
            color: "text-rose-500", 
            bg: "bg-rose-50/50", 
            border: "border-rose-100", 
            trend: "0.0%" 
          },
        ].map((m, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`${m.bg} ${m.border} border p-8 rounded-[40px] shadow-sm relative overflow-hidden group`}
          >
             <div className="flex justify-between items-start relative z-10">
                <div>
                   <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">{m.label}</p>
                   <h2 className="text-2xl font-bold text-[#0F172A] mb-4">{formatCurrency(m.val)}</h2>
                   <div className="flex items-center gap-2">
                       <span className="bg-white/60 px-2 py-1 rounded-lg text-[10px] font-bold text-slate-500">{m.count} Invoices</span>
                   </div>
                </div>
                <div className="flex flex-col items-end gap-6">
                   <div className={`flex items-center gap-1 text-[10px] font-bold ${m.color}`}>
                      <TrendingUp size={12} /> {m.trend}
                   </div>
                   <div className="h-10 w-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-400 group-hover:bg-[#0F172A] group-hover:text-white transition-all">
                      <m.icon size={18} />
                   </div>
                </div>
             </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm space-y-8">
        {/* Table Action Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
           {/* Search */}
           <div className="lg:col-span-3 relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#0F172A] transition-colors" size={18} />
              <input 
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search for customer, email or ID..." 
                className="w-full bg-slate-50/50 border border-slate-100 pl-14 pr-6 py-4 rounded-2xl font-ui text-sm outline-none focus:ring-2 ring-slate-100" 
              />
           </div>
           
           {/* Date Select Mock */}
           <div className="relative">
              <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <button disabled className="w-full bg-slate-50/50 border border-slate-100 pl-14 pr-6 py-4 rounded-2xl font-ui text-sm text-left text-slate-400">Select Date</button>
           </div>

           {/* Status Select */}
           <div className="relative">
              <select 
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="w-full bg-slate-50/50 border border-slate-100 px-6 py-4 rounded-2xl font-ui text-sm outline-none appearance-none font-bold text-[#0F172A]"
              >
                <option value="All">All Status</option>
                <option value="Paid">Paid</option>
                <option value="Unpaid">Unpaid</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Refund">Refund</option>
              </select>
              <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={16} />
           </div>

           {/* Filter Button */}
           <button className="bg-sky-500 text-white rounded-2xl px-8 py-4 font-ui text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20 hover:bg-sky-600 transition-all">
              <Filter size={16} /> Filters
           </button>
        </div>

        {/* Invoice Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/10 border-b border-slate-50">
                <th className="p-6 font-ui text-[10px] uppercase tracking-widest text-slate-400">ID</th>
                <th className="p-6 font-ui text-[10px] uppercase tracking-widest text-slate-400">Customer</th>
                <th className="p-6 font-ui text-[10px] uppercase tracking-widest text-slate-400">Email</th>
                <th className="p-6 font-ui text-[10px] uppercase tracking-widest text-slate-400">Country</th>
                <th className="p-6 font-ui text-[10px] uppercase tracking-widest text-slate-400">Date</th>
                <th className="p-6 font-ui text-[10px] uppercase tracking-widest text-slate-400">Amount</th>
                <th className="p-6 font-ui text-[10px] uppercase tracking-widest text-slate-400">Payment Status</th>
                <th className="p-6 font-ui text-[10px] uppercase tracking-widest text-slate-400 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
               {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse h-20 bg-slate-50/5" />
                  ))
               ) : filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="group hover:bg-slate-50/30 transition-colors">
                    <td className="p-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-blue-500 text-xs">{inv.invoice?.invoiceNumber || `#${inv.orderNumber}`}</span>
                        {inv.invoice?.channel && (
                          <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mt-1">
                            {inv.invoice.channel === "STORE" ? "Store" : "Website"}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-6 whitespace-nowrap">
                       <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-xl bg-slate-100 overflow-hidden shadow-sm flex items-center justify-center text-[10px] font-bold text-blue-500">
                             {inv.user.firstName[0]}{inv.user.lastName[0]}
                          </div>
                          <span className="font-display font-bold text-[#0F172A] text-sm">{inv.user.firstName} {inv.user.lastName}</span>
                       </div>
                    </td>
                    <td className="p-6 text-xs text-slate-500">{inv.user.email}</td>
                    <td className="p-6 text-xs text-slate-400 font-bold uppercase tracking-widest">India</td>
                    <td className="p-6 text-xs text-slate-400">{new Date(inv.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                    <td className="p-6 font-display font-bold text-[#0F172A]">{formatCurrency(inv.total)}</td>
                    <td className="p-6">
                       <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                         inv.status === 'PAID' || inv.status === 'DELIVERED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                         inv.status === 'CANCELLED' ? 'bg-rose-50 text-rose-600 border-rose-100' : 
                         'bg-amber-50 text-amber-600 border-amber-100'
                       }`}>
                          {inv.status === 'PAID' || inv.status === 'DELIVERED' ? 'PAID' : inv.status}
                       </span>
                    </td>
                    <td className="p-6 text-right relative">
                       <button 
                         onClick={() => setActiveMenu(activeMenu === inv.id ? null : inv.id)}
                         className="h-9 w-9 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 hover:bg-[#0F172A] hover:text-white transition-all shadow-sm"
                       >
                          <MoreHorizontal size={18} />
                       </button>
                       {activeMenu === inv.id && (
                          <div className="absolute right-6 top-16 z-[50] w-48 bg-white border border-slate-100 rounded-2xl shadow-2xl p-2 animate-in fade-in slide-in-from-top-2 duration-200">
                             {[
                               { label: "View", icon: Eye, href: `/admin/invoices/${inv.id}` },
                               { label: "Edit", icon: Edit, href: `/admin/invoices/edit/${inv.id}` },
                               { label: "Download", icon: Download, href: "#" },
                               { label: "Delete", icon: Trash2, color: "text-rose-500", onClick: () => {} },
                             ].map((item, idx) => (
                               <Link 
                                 href={item.href || "#"}
                                 key={idx}
                                 className={`flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 transition-all text-[11px] font-bold uppercase tracking-widest ${item.color || "text-[#0F172A]"}`}
                               >
                                  <item.icon size={14} /> {item.label}
                               </Link>
                             ))}
                          </div>
                       )}
                    </td>
                  </tr>
               ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
