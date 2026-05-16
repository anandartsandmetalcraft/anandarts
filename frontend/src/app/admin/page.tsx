"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Truck,
  TrendingUp,
  ArrowUpRight,
  User,
  Users,
  Package,
  IndianRupee,
  CalendarDays,
  ChevronDown,
  DownloadCloud,
  Compass,
  Sparkles,
  CreditCard,
  Plus,
  FileText,
  Filter,
  MoreVertical,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getAdminStats } from "@/actions/admin";
import { AdminDashboardSkeleton } from "@/components/shared/Skeleton";
import ExportReportModal from "@/components/admin/ExportReportModal";
import { FinancialOverview } from "@/components/admin/FinancialOverview";

const EMPTY_STATS = {
  totalProducts: 0,
  totalOrders: 0,
  totalRevenue: 0,
  totalCustomers: 0,
  lowStockCount: 0,
  recentOrders: [],
  growth: {
    revenue: 0,
    orders: 0,
    customers: 0,
    products: 0,
  },
  breakdown: {
    successful: 0,
    pending: 0,
    processing: 0,
  },
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(EMPTY_STATS);
  const [warning, setWarning] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [dateRange, setDateRange] = useState("01 Jan, 2026 to 31 Dec, 2026");
  const [reportMenuOpen, setReportMenuOpen] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      const res = await getAdminStats();

      if (res.success) {
        setStats(res.stats ?? EMPTY_STATS);
        setWarning(res.warning ?? null);
      } else {
        setStats(EMPTY_STATS);
        setWarning(res.error ?? "Unable to load dashboard data.");
      }

      setIsLoading(false);
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return <AdminDashboardSkeleton />;
  }

  const metricCards = [
    {
      title: "Total Revenue",
      value: `₹ ${(stats.totalRevenue / 100).toLocaleString("en-IN")}`,
      subtitle: "Total sales across all channels",
      icon: IndianRupee,
      badge: `${stats.growth?.revenue >= 0 ? "+" : ""}${stats.growth?.revenue}%`,
      color: stats.growth?.revenue >= 0 
        ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
        : "bg-rose-50 text-rose-600 border-rose-100",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      subtitle: "Total orders processed",
      icon: ShoppingBag,
      badge: `${stats.growth?.orders >= 0 ? "+" : ""}${stats.growth?.orders}%`,
      color: stats.growth?.orders >= 0 
        ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
        : "bg-rose-50 text-rose-600 border-rose-100",
      negative: stats.growth?.orders < 0,
    },
    {
      title: "Total Customers",
      value: stats.totalCustomers,
      subtitle: "Unique registered buyers",
      icon: Users,
      badge: `${stats.growth?.customers >= 0 ? "+" : ""}${stats.growth?.customers}%`,
      color: stats.growth?.customers >= 0 
        ? "bg-blue-50 text-blue-600 border-blue-100" 
        : "bg-rose-50 text-rose-600 border-rose-100",
    },
    {
      title: "Total Products",
      value: stats.totalProducts,
      subtitle: "Items in catalog",
      icon: Package,
      badge: `${stats.growth?.products >= 0 ? "+" : ""}${stats.growth?.products}%`,
      color: stats.growth?.products >= 0 
        ? "bg-amber-50 text-amber-600 border-amber-100" 
        : "bg-rose-50 text-rose-600 border-rose-100",
    },
  ];

  return (
    <>
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Warning Header */}
      {warning && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-amber-200 bg-amber-50/50 px-6 py-4 flex items-center gap-3"
        >
          <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
          <p className="font-ui text-xs font-bold uppercase tracking-widest text-amber-900">{warning}</p>
        </motion.div>
      )}

      {/* Metric Grid */}
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {metricCards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative overflow-hidden rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-[#0F172A] group-hover:bg-[#0F172A] group-hover:text-white transition-colors duration-500">
                  <card.icon size={22} strokeWidth={1.5} />
                </div>
                <div>
                  <p className="font-ui text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">{card.title}</p>
                  <p className="mt-1 font-display text-3xl font-bold tracking-tight text-[#0F172A]">{card.value}</p>
                </div>
              </div>
              <div className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold ${card.color} border`}>
                {card.badge}
              </div>
            </div>
            
            <div className="mt-6 flex items-center justify-between border-t border-slate-50 pt-4">
              <p className="text-[11px] text-slate-500">{card.subtitle}</p>
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-6 w-6 rounded-full border-2 border-white bg-slate-100" />
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <FinancialOverview
        grossRevenuePaise={stats.financialOverview?.grossRevenue ?? 0}
        taxableValuePaise={stats.financialOverview?.taxableValue ?? 0}
        cgstPaise={stats.financialOverview?.cgst ?? 0}
        sgstPaise={stats.financialOverview?.sgst ?? 0}
        igstPaise={stats.financialOverview?.igst ?? 0}
      />

      {/* Main Content Area */}
      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* Revenue Chart Section */}
        <div className="rounded-[40px] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-ui text-[10px] font-bold uppercase tracking-[0.3em] text-[#D4AF37]">Revenue History</p>
              <h2 className="mt-1 font-display text-3xl font-bold text-[#0F172A]">Sales Overview</h2>
            </div>
            <div className="flex items-center gap-1.5 rounded-2xl bg-slate-50 p-1">
              {['ALL', '1M', '6M', '1Y'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`rounded-xl px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all ${
                    activeFilter === filter ? 'bg-white text-[#0F172A] shadow-sm' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 rounded-[32px] bg-slate-50/50 p-6 border border-slate-100">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-slate-400">Total Orders</p>
              <p className="mt-1 text-2xl font-bold text-[#0F172A]">{stats.totalOrders}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-slate-400">Net Revenue</p>
              <p className="mt-1 text-2xl font-bold text-emerald-600">₹ {(stats.totalRevenue / 100).toLocaleString("en-IN")}</p>
            </div>
            <div className="flex items-center justify-md-end">
              <button
                onClick={() => setShowExportModal(true)}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 font-ui text-[10px] font-bold uppercase tracking-widest text-slate-600 shadow-sm hover:bg-[#0F172A] hover:text-white hover:border-[#0F172A] transition-all"
              >
                <DownloadCloud size={16} /> Export Report
              </button>
            </div>
          </div>

          <div className="mt-10 h-[380px] w-full bg-white rounded-3xl relative p-4 border border-slate-50">
             {/* Simple SVG Chart Mockup for visual premium feel */}
             <svg viewBox="0 0 1000 300" className="h-full w-full opacity-80" preserveAspectRatio="none">
               <defs>
                 <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                   <stop offset="0%" stopColor="#0F172A" stopOpacity="0.1" />
                   <stop offset="100%" stopColor="#0F172A" stopOpacity="0" />
                 </linearGradient>
               </defs>
               <path d="M0,250 C100,220 200,240 300,180 C400,120 500,150 600,80 C700,10 800,40 1000,20 L1000,300 L0,300 Z" fill="url(#chartGradient)" />
               <path d="M0,250 C100,220 200,240 300,180 C400,120 500,150 600,80 C700,10 800,40 1000,20" fill="none" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
               <circle cx="600" cy="80" r="6" fill="#D4AF37" stroke="white" strokeWidth="3 shadow-xl" />
             </svg>
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-200 pointer-events-none">
               <TrendingUp size={120} strokeWidth={0.5} className="rotate-[-10deg]" />
             </div>
          </div>
        </div>

        {/* Right Sidebar: Activity & Status */}
        <div className="space-y-8">
          <div className="rounded-[40px] border border-slate-200 bg-[#0F172A] p-8 text-white shadow-xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform duration-700">
                <CreditCard size={120} />
             </div>
             <p className="font-ui text-[10px] font-bold uppercase tracking-[0.3em] text-[#D4AF37]">Invoice Center</p>
             <h3 className="mt-2 font-display text-2xl font-bold leading-tight">Quick Billing</h3>
             <p className="mt-4 text-sm text-slate-300 leading-relaxed font-ui">Generate POS invoices for in-store customers or manage website receipts.</p>
             <div className="mt-8 space-y-3 relative z-10">
                <Link href="/admin/invoices/new" className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#D4AF37] px-6 py-4 font-ui text-[11px] font-bold uppercase tracking-[0.2em] text-[#0F172A] hover:bg-[#F0D080] transition-all active:scale-[0.98]">
                  <Plus size={16}/> New Invoice (POS)
                </Link>
                <Link href="/admin/invoices" className="w-full flex items-center justify-center gap-2 rounded-2xl bg-white/5 border border-white/10 px-6 py-4 font-ui text-[11px] font-bold uppercase tracking-[0.2em] text-white hover:bg-white/10 transition-all">
                  <FileText size={16}/> View Ledger
                </Link>
             </div>
          </div>

          <div className="rounded-[40px] border border-slate-200 bg-white p-8 shadow-sm">
            <h3 className="font-display text-xl font-bold text-[#0F172A] mb-6">Recent Records</h3>
            <div className="space-y-6">
              {[
                { label: 'Successful Orders', value: stats.breakdown?.successful || 0, color: 'bg-emerald-500', percent: stats.totalOrders > 0 ? (stats.breakdown?.successful / stats.totalOrders) * 100 : 0 },
                { label: 'Pending Verification', value: stats.breakdown?.pending || 0, color: 'bg-amber-500', percent: stats.totalOrders > 0 ? (stats.breakdown?.pending / stats.totalOrders) * 100 : 0 },
                { label: 'In Processing', value: stats.breakdown?.processing || 0, color: 'bg-blue-500', percent: stats.totalOrders > 0 ? (stats.breakdown?.processing / stats.totalOrders) * 100 : 0 },
              ].map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{item.label}</span>
                    <span className="text-sm font-bold text-[#0F172A]">{item.value}</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.max(10, item.percent)}%` }}
                      transition={{ delay: 0.5 + (i * 0.1), duration: 1 }}
                      className={`h-full ${item.color} rounded-full`} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="rounded-[40px] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-10">
          <div>
            <h3 className="font-display text-2xl font-bold text-[#0F172A]">Order Ledger</h3>
            <p className="text-sm text-slate-500 mt-1">Real-time overview of store transactions.</p>
          </div>
          <Link href="/admin/orders" className="flex items-center gap-2 font-ui text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] hover:underline px-4 py-2 rounded-xl bg-slate-50">
            View All Ledger <ArrowUpRight size={14} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 uppercase tracking-[0.2em] font-ui text-[9px] text-slate-400">
                <th className="pb-6 pl-2">Customer</th>
                <th className="pb-6">Order Number</th>
                <th className="pb-6">Total</th>
                <th className="pb-6">Status</th>
                <th className="pb-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-data">
              {stats.recentOrders.map((order: any) => (
                <tr key={order.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="py-6 flex items-center gap-4">
                    <div className="h-11 w-11 rounded-full bg-slate-100 border border-slate-100 flex items-center justify-center text-[#0F172A] font-bold text-xs ring-4 ring-transparent group-hover:ring-[#D4AF37]/10 transition-all overflow-hidden">
                      {order.user.image ? (
                        <img src={order.user.image} alt={order.user.firstName} className="h-full w-full object-cover" />
                      ) : (
                        <span className="uppercase">{order.user.firstName[0]}{order.user.lastName[0]}</span>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#0F172A]">
                        {order.user.firstName} {order.user.lastName}
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </p>
                    </div>
                  </td>
                  <td className="py-6 text-sm font-semibold text-slate-600">{order.orderNumber}</td>
                  <td className="py-6 text-sm font-bold text-[#0F172A]">
                    ₹ {(order.total / 100).toLocaleString("en-IN")}
                  </td>
                  <td className="py-6">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-ui text-[9px] font-bold uppercase tracking-wider ${
                        order.status === "PAID" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-slate-50 text-slate-500 border border-slate-100"
                      }`}
                    >
                      <div className={`h-1.5 w-1.5 rounded-full ${order.status === "PAID" ? "bg-emerald-500" : "bg-slate-400"}`} />
                      {order.status}
                    </span>
                  </td>
                  <td className="py-6 text-right pr-2">
                    <button className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-[#0F172A] hover:bg-slate-100 transition-all">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {stats.recentOrders.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-3">
                      <Compass size={40} strokeWidth={1} className="text-slate-200" />
                      <p className="font-ui text-[10px] font-bold uppercase tracking-[0.2em]">No orders found.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    {/* Financial Export Modal */}
    <ExportReportModal
      open={showExportModal}
      onClose={() => setShowExportModal(false)}
    />
    </>
  );
}
