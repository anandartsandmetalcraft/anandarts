"use client";
import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { 
  Truck, 
  Search, 
  MapPin, 
  CreditCard, 
  MoreVertical, 
  CheckCircle, 
  Clock, 
  X, 
  Package, 
  ChevronDown,
  Calendar,
  Ban,
  ShoppingBag,
  ArrowRight,
  Eye,
  Settings2,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Trash2
} from "lucide-react";
import { getAllAdminOrders, updateOrderStatus } from "@/actions/admin";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [paymentFilter, setPaymentFilter] = useState("All");
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchOrders = async () => {
    setIsLoading(true);
    const res = await getAllAdminOrders();
    if (res.success) {
      setOrders(res.orders!);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchOrders();
    const syncOrders = () => {
      void fetchOrders();
    };

    const interval = window.setInterval(syncOrders, 30000);
    window.addEventListener("focus", syncOrders);
    document.addEventListener("visibilitychange", syncOrders);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", syncOrders);
      document.removeEventListener("visibilitychange", syncOrders);
    };
  }, []);

  // Metrics calculation
  const metrics = useMemo(() => {
    const counts = {
      new: 0,
      pending: 0,
      delivered: 0,
      shipped: 0,
      cancelled: 0
    };
    orders.forEach(o => {
      const s = o.status;
      if (s === 'PAID') counts.new++;
      if (s === 'PENDING') counts.pending++;
      if (s === 'DELIVERED') counts.delivered++;
      if (s === 'SHIPPED') counts.shipped++;
      if (s === 'CANCELLED') counts.cancelled++;
    });
    return counts;
  }, [orders]);

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.orderNumber.toLowerCase().includes(search.toLowerCase()) || 
                          `${o.user.firstName} ${o.user.lastName}`.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || o.status === statusFilter;
    
    // Payment filter logic (PhonePe is default for paid)
    const matchesPayment = paymentFilter === "All" || (paymentFilter === "UPI" && o.status !== "PENDING");
    
    return matchesSearch && matchesStatus && matchesPayment;
  });

  // Calculate slice
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'SHIPPED': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'DELIVERED': return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'CANCELLED': return 'bg-rose-50 text-rose-600 border-rose-100';
      default: return 'bg-slate-50 text-slate-500 border-slate-100';
    }
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const data = Object.fromEntries(formData);
    
    const res = await updateOrderStatus(selectedOrder.id, data);
    if (res.success) {
      toast.success("Order record updated.");
      setShowStatusModal(false);
      fetchOrders();
    } else {
      toast.error(res.error);
    }
  };

  return (
    <div className="space-y-10 min-h-screen pb-20 font-ui text-sm">
      
      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {[
          { label: "New Orders", val: metrics.new, icon: ShoppingBag, color: "text-blue-500", bg: "bg-blue-50" },
          { label: "Pending", val: metrics.pending, icon: Clock, color: "text-amber-500", bg: "bg-amber-50" },
          { label: "Delivered", val: metrics.delivered, icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-50" },
          { label: "In Transit", val: metrics.shipped, icon: Truck, color: "text-purple-500", bg: "bg-purple-50" },
          { label: "Cancelled Orders", val: metrics.cancelled, icon: Ban, color: "text-rose-500", bg: "bg-rose-50" },
        ].map((m, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-col gap-4"
          >
            <div className={`h-12 w-12 rounded-2xl ${m.bg} flex items-center justify-center ${m.color}`}>
               <m.icon size={24} />
            </div>
            <div>
              <h4 className="font-display text-2xl font-bold text-[#0F172A]">{m.val}</h4>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">{m.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Header & Filter Bar */}
      <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
           <h2 className="font-display text-3xl font-bold text-[#0F172A]">Listing View</h2>
           <div className="flex items-center gap-2">
             <span className="text-xs font-bold text-slate-400 mr-2">Orders</span>
             <ChevronDown size={14} className="text-slate-300" />
             <span className="text-xs font-bold text-slate-700">List View</span>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
           {/* Search */}
           <div className="lg:col-span-1 relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#0F172A] transition-colors" size={18} />
              <input 
                value={search}
                onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
                placeholder="Search..." 
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
                onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                className="w-full bg-slate-50/50 border border-slate-100 px-6 py-4 rounded-2xl font-ui text-sm outline-none appearance-none font-bold text-[#0F172A]"
              >
                <option value="All">All Status</option>
                <option value="PAID">Paid</option>
                <option value="SHIPPED">Shipped</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
              <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={16} />
           </div>

           {/* Payment Select */}
           <div className="relative">
              <select 
                value={paymentFilter}
                onChange={e => { setPaymentFilter(e.target.value); setCurrentPage(1); }}
                className="w-full bg-slate-50/50 border border-slate-100 px-6 py-4 rounded-2xl font-ui text-sm outline-none appearance-none font-bold text-[#0F172A]"
              >
                <option value="All">Payment Mode</option>
                <option value="UPI">PhonePe UPI</option>
                <option value="COD">Cash (COD)</option>
              </select>
              <CreditCard className="absolute right-12 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={16} />
              <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={16} />
           </div>

           {/* Filter Button */}
           <button className="bg-blue-500 text-white rounded-2xl px-8 py-4 font-ui text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-3 shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-all group">
              <SlidersHorizontal size={18} className="group-hover:rotate-180 transition-transform duration-500" /> Filter
           </button>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-y border-slate-50">
                <th className="p-6 font-ui text-[10px] uppercase tracking-widest text-slate-400">Order ID</th>
                <th className="p-6 font-ui text-[10px] uppercase tracking-widest text-slate-400">Customer</th>
                <th className="p-6 font-ui text-[10px] uppercase tracking-widest text-slate-400">Product Name</th>
                <th className="p-6 font-ui text-[10px] uppercase tracking-widest text-slate-400">Amount</th>
                <th className="p-6 font-ui text-[10px] uppercase tracking-widest text-slate-400">Order Date</th>
                <th className="p-6 font-ui text-[10px] uppercase tracking-widest text-slate-400">Delivery Status</th>
                <th className="p-6 font-ui text-[10px] uppercase tracking-widest text-slate-400">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
               {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={7} className="p-6 h-20 bg-slate-50/10" />
                    </tr>
                  ))
               ) : paginatedOrders.map((order) => {
                  const firstItemName = order.items?.[0]?.product?.name || "Artifact";
                  const otherItemsCount = (order.items?.length || 1) - 1;
                  
                  return (
                    <tr key={order.id} className="group hover:bg-slate-50/30 transition-colors">
                      <td className="p-6">
                        <div className="flex flex-col">
                          <Link href={`/admin/orders/${order.id}`} className="font-bold text-blue-500 hover:underline">
                             {order.orderNumber}
                          </Link>
                          {order.invoice?.invoiceNumber && (
                            <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">
                              Inv: {order.invoice.invoiceNumber}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-6 font-display font-medium text-[#0F172A]">
                         {order.user.firstName} {order.user.lastName}
                      </td>
                      <td className="p-6 text-xs text-slate-500">
                         {firstItemName}
                         {otherItemsCount > 0 && <span className="ml-2 text-[10px] font-bold text-blue-500">+{otherItemsCount} more</span>}
                      </td>
                      <td className="p-6 font-display font-bold text-[#0F172A]">
                         ₹{(order.total / 100).toLocaleString("en-IN")}
                      </td>
                      <td className="p-6 text-xs text-slate-400">
                         {new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="p-6">
                         <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getStatusColor(order.status)}`}>
                            {order.status}
                         </span>
                      </td>
                      <td className="p-6">
                         <div className="flex items-center justify-end gap-2">
                            <Link 
                              href={`/admin/orders/${order.id}`} 
                              className="h-10 w-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:bg-[#0F172A] hover:text-white transition-all shadow-sm"
                              title="View Order Details"
                            >
                               <Eye size={16} />
                            </Link>
                            <button 
                              onClick={() => { setSelectedOrder(order); setShowStatusModal(true); }}
                              className="h-10 w-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:bg-blue-500 hover:text-white transition-all shadow-sm"
                              title="Update Fulfillment"
                            >
                               <Settings2 size={16} />
                            </button>
                            <button 
                              onClick={() => {
                                if(confirm("Permanently purge this order from database? This cannot be undone.")) {
                                  setOrders(orders.filter(o => o.id !== order.id));
                                  toast.success("Order record purged.");
                                }
                              }}
                              className="h-10 w-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-rose-300 hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                              title="Delete Order"
                            >
                               <Trash2 size={16} />
                            </button>
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
               <p className="font-ui text-xs font-bold uppercase tracking-widest text-slate-400">No matching orders found</p>
            </div>
          )}
        </div>

        {/* Table Footer / Pagination */}
        <div className="pt-8 border-t border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4">
           <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              Showing <span className="text-[#0F172A]">{Math.min(filteredOrders.length, (currentPage - 1) * itemsPerPage + 1)}</span> to <span className="text-[#0F172A]">{Math.min(filteredOrders.length, currentPage * itemsPerPage)}</span> of <span className="text-[#0F172A]">{filteredOrders.length}</span> items
           </div>
           
           <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-100 text-[10px] font-bold uppercase tracking-widest disabled:opacity-30 hover:bg-slate-50 transition-all"
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
                 className="flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-100 text-[10px] font-bold uppercase tracking-widest disabled:opacity-30 hover:bg-slate-50 transition-all"
              >
                 Next <ChevronRight size={14} />
              </button>
           </div>
        </div>
      </div>

      {/* Status Modal */}
      <AnimatePresence>
        {showStatusModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
             <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative bg-white rounded-[40px] w-full max-w-xl overflow-hidden shadow-2xl">
                <div className="p-10">
                   <div className="flex justify-between items-center mb-10">
                      <div>
                        <h3 className="font-display text-2xl font-bold text-[#0F172A]">Update Order Record</h3>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">Order Ref: {selectedOrder.orderNumber}</p>
                      </div>
                      <button onClick={() => setShowStatusModal(false)} className="p-2 hover:bg-black/5 rounded-full transition-colors"><X size={24} /></button>
                   </div>
  
                   <form onSubmit={handleUpdateStatus} className="space-y-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-2">Progress Status</label>
                         <div className="relative">
                            <select name="status" defaultValue={selectedOrder.status} className="w-full bg-slate-50 border-none px-6 py-4 rounded-2xl font-ui text-sm outline-none appearance-none font-bold text-[#0F172A]">
                               <option value="PAID">Awaiting Shipment</option>
                               <option value="SHIPPED">In Transit</option>
                               <option value="DELIVERED">Delivered / Handed Over</option>
                               <option value="CANCELLED">Void / Cancelled</option>
                            </select>
                            <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={16} />
                         </div>
                      </div>
  
                      <div className="grid grid-cols-2 gap-6">
                         <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-2">Courier Partner</label>
                            <input name="shippingCarrier" placeholder="e.g. BlueDart" defaultValue={selectedOrder.shippingCarrier || ''} className="w-full bg-slate-50 border-none px-6 py-4 rounded-2xl font-ui text-sm outline-none font-bold placeholder:font-normal" />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-2">Traking Ref No.</label>
                            <input name="trackingId" placeholder="AWB Number" defaultValue={selectedOrder.trackingId || ''} className="w-full bg-slate-50 border-none px-6 py-4 rounded-2xl font-ui text-sm outline-none font-bold placeholder:font-normal" />
                         </div>
                      </div>
  
                      <div className="pt-8">
                         <button type="submit" className="w-full bg-[#0F172A] text-white font-ui text-[11px] font-bold uppercase tracking-[0.2em] py-5 rounded-[24px] shadow-xl hover:bg-black transition-all active:scale-[0.98]">
                            Apply Progress Changes
                         </button>
                      </div>
                   </form>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
