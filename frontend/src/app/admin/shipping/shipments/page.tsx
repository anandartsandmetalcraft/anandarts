"use client";
import React, { useState, useEffect, useMemo } from "react";
import { 
  Search, 
  ChevronDown, 
  Calendar, 
  Plus, 
  SlidersHorizontal, 
  Edit, 
  Trash2, 
  ArrowUpRight,
  Package,
  MapPin,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { getAllAdminOrders } from "@/actions/admin";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ShipmentsPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    async function fetch() {
      const res = await getAllAdminOrders();
      if (res.success) setOrders(res.orders || []);
      setIsLoading(false);
    }
    fetch();

    const syncShipments = () => {
      void fetch();
    };

    const interval = window.setInterval(syncShipments, 30000);
    window.addEventListener("focus", syncShipments);
    document.addEventListener("visibilitychange", syncShipments);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", syncShipments);
      document.removeEventListener("visibilitychange", syncShipments);
    };
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchesSearch = o.orderNumber.toLowerCase().includes(search.toLowerCase()) || 
                          `${o.user.firstName} ${o.user.lastName}`.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "All" || o.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  const paginatedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED': return 'bg-emerald-50 text-emerald-500 border-emerald-100';
      case 'SHIPPED': return 'bg-blue-50 text-blue-500 border-blue-100';
      case 'PAID': return 'bg-purple-50 text-purple-500 border-purple-100';
      case 'CANCELLED': return 'bg-rose-50 text-rose-500 border-rose-100';
      default: return 'bg-slate-50 text-slate-400 border-slate-100';
    }
  };

  return (
    <div className="space-y-8 pb-20 font-ui text-sm">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
             <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Toner</span>
             <ChevronRight size={12} className="text-slate-300" />
             <span className="text-slate-700 font-bold uppercase tracking-widest text-[10px]">Shipments</span>
          </div>
          <h1 className="text-3xl font-bold text-[#0F172A]">Shipping</h1>
        </div>
        <button className="flex items-center gap-2 rounded-2xl bg-[#0BB197] px-8 py-4 text-[11px] font-bold uppercase tracking-widest text-white shadow-lg transition hover:brightness-110 active:scale-95">
           <Plus size={16} /> Add Shipping
        </button>
      </div>

      {/* Filter Card */}
      <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
           {/* Search */}
           <div className="lg:col-span-1 relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#0F172A] transition-colors" size={18} />
              <input 
                value={search}
                onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
                placeholder="Search for order ID..." 
                className="w-full bg-slate-50/50 border border-slate-100 pl-14 pr-6 py-4 rounded-2xl font-ui text-xs outline-none focus:ring-2 ring-slate-100 font-bold text-[#0F172A] placeholder:font-normal" 
              />
           </div>
           
           {/* Date Select */}
           <div className="relative">
              <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <button disabled className="w-full bg-slate-50/50 border border-slate-100 pl-14 pr-6 py-4 rounded-2xl font-ui text-xs text-left text-slate-400 font-bold">Select date</button>
           </div>

           {/* Status Select */}
           <div className="relative">
              <select 
                value={statusFilter}
                onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                className="w-full bg-slate-50/50 border border-slate-100 px-6 py-4 rounded-2xl font-ui text-xs outline-none appearance-none font-bold text-[#0F172A]"
              >
                <option value="All">Status</option>
                <option value="DELIVERED">Delivered</option>
                <option value="SHIPPED">Out of Delivery</option>
                <option value="PAID">Pickups</option>
                <option value="PENDING">Pending</option>
              </select>
              <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={16} />
           </div>

           {/* Generic Select */}
           <div className="relative">
              <select className="w-full bg-slate-50/50 border border-slate-100 px-6 py-4 rounded-2xl font-ui text-xs outline-none appearance-none font-bold text-[#0F172A]">
                <option>All</option>
              </select>
              <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={16} />
           </div>

           {/* Filter Button */}
           <button className="bg-blue-500 text-white rounded-2xl px-8 py-4 font-ui text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-3 shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-all group">
              Filters
           </button>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/10 border-b border-slate-50">
                <th className="p-6 font-ui text-[11px] font-bold text-slate-400 uppercase tracking-widest">Order ID</th>
                <th className="p-6 font-ui text-[11px] font-bold text-slate-400 uppercase tracking-widest">Shipment No</th>
                <th className="p-6 font-ui text-[11px] font-bold text-slate-400 uppercase tracking-widest">Customer</th>
                <th className="p-6 font-ui text-[11px] font-bold text-slate-400 uppercase tracking-widest">Supplier</th>
                <th className="p-6 font-ui text-[11px] font-bold text-slate-400 uppercase tracking-widest">Location</th>
                <th className="p-6 font-ui text-[11px] font-bold text-slate-400 uppercase tracking-widest">Arrival Date</th>
                <th className="p-6 font-ui text-[11px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                <th className="p-6 font-ui text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
               {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse h-20 bg-slate-50/10" />
                  ))
               ) : paginatedOrders.map((order) => {
                  return (
                    <tr key={order.id} className="group hover:bg-slate-50/30 transition-colors">
                      <td className="p-6">
                        <Link href={`/admin/orders/${order.id}`} className="font-bold text-blue-500 hover:underline">
                           {order.orderNumber}
                        </Link>
                      </td>
                      <td className="p-6 text-xs text-slate-500 font-bold uppercase tracking-widest">
                         #{order.id.slice(-8).toUpperCase()}
                      </td>
                      <td className="p-6 font-bold text-[#0F172A] whitespace-nowrap">
                         {order.user.firstName} {order.user.lastName}
                      </td>
                      <td className="p-6 text-xs text-slate-500 font-bold">
                         Anand Arts WH
                      </td>
                      <td className="p-6 text-xs text-slate-500 whitespace-nowrap">
                         {order.address.city}, {order.address.state}
                      </td>
                      <td className="p-6 text-xs text-slate-500 font-medium">
                         {new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="p-6">
                         <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getStatusColor(order.status)}`}>
                            {order.status}
                         </span>
                      </td>
                      <td className="p-6">
                         <div className="flex items-center justify-center gap-2">
                           <button className="h-8 px-4 bg-sky-50 text-sky-500 rounded-lg text-[10px] font-bold hover:bg-sky-500 hover:text-white transition-all shadow-sm">Edit</button>
                           <button className="h-8 px-4 bg-rose-50 text-rose-500 rounded-lg text-[10px] font-bold hover:bg-rose-500 hover:text-white transition-all shadow-sm">Delete</button>
                         </div>
                      </td>
                    </tr>
                  );
               })}
            </tbody>
          </table>
          
          {filteredOrders.length === 0 && !isLoading && (
            <div className="py-20 flex flex-col items-center justify-center text-center">
               <Package size={48} className="text-slate-100 mb-4" />
               <p className="font-ui text-[10px] font-bold uppercase tracking-widest text-slate-400">No shipments matched your criteria</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="pt-8 border-t border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4">
           <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              Showing <span className="text-[#0F172A]">{Math.min(filteredOrders.length, (currentPage - 1) * itemsPerPage + 1)}</span> to <span className="text-[#0F172A]">{Math.min(filteredOrders.length, currentPage * itemsPerPage)}</span> of {filteredOrders.length} shipments
           </div>
           
           <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-100 text-[10px] font-bold uppercase tracking-widest disabled:opacity-30 hover:bg-slate-50 transition-all text-slate-600"
              >
                 <ChevronLeft size={14} /> Previous
              </button>
              <div className="flex items-center">
                 {Array.from({ length: totalPages }).map((_, i) => (
                    <button 
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`h-10 w-10 rounded-xl text-[10px] font-bold transition-all ${currentPage === i + 1 ? 'bg-[#0F172A] text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}
                    >
                       {i + 1}
                    </button>
                 ))}
              </div>
              <button 
                 onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                 disabled={currentPage === totalPages || totalPages === 0}
                 className="flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-100 text-[10px] font-bold uppercase tracking-widest disabled:opacity-30 hover:bg-slate-50 transition-all text-slate-600"
              >
                 Next <ChevronRight size={14} />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
