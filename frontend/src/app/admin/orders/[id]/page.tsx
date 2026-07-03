import Link from "next/link";
import { 
  ArrowLeft, 
  Download, 
  Package, 
  Truck, 
  User, 
  MapPin, 
  CreditCard, 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Map,
  XCircle,
  Hash
} from "lucide-react";
import { getAdminOrderById } from "@/actions/admin";
import Image from "next/image";
import { OrderTracking } from "@/components/ui/order-tracking";

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value / 100);
}

export default async function AdminOrderDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const res = await getAdminOrderById(id);

  if (!res.success || !res.order) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="rounded-[40px] border border-slate-100 bg-white p-12 text-center shadow-sm">
          <XCircle size={48} className="mx-auto text-rose-500 mb-6" />
          <p className="text-xl font-bold text-[#0F172A]">Order not found</p>
          <p className="mt-2 text-sm text-slate-500">The specific ID was not detected in our records.</p>
          <Link href="/admin/orders" className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-[#0F172A] px-8 py-4 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-black shadow-lg">
            <ArrowLeft size={16} /> Back to Listings
          </Link>
        </div>
      </div>
    );
  }

  const { order } = res;
  const address = order.address;
  const user = order.user;
  const items = order.items ?? [];

  // Determine timeline progress based on status
  const statuses = ["Order Process", "Packed", "Order Shipped", "Out Of Delivery", "Delivered"];
  const currentStatusIdx = 
    order.status === 'DELIVERED' ? 4 : 
    order.status === 'SHIPPED' ? 2 : 
    order.status === 'PAID' ? 1 : 0;

  return (
    <div className="space-y-10 pb-20">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
             <Link href="/admin/orders" className="text-slate-400 hover:text-[#0F172A] transition-colors"><Hash size={14} /></Link>
             <span className="text-slate-300">/</span>
             <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Orders Overview</span>
          </div>
          <h1 className="text-3xl font-bold text-[#0F172A]">Order ID: {order.orderNumber}</h1>
        </div>
        <button className="flex items-center gap-2 rounded-2xl bg-[#7C3AED] px-8 py-4 text-[11px] font-bold uppercase tracking-widest text-white shadow-lg transition hover:bg-[#6D28D9] active:scale-95">
           <Download size={16} /> Invoice
        </button>
      </div>

      {/* Top Cards Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Customer Info */}
        <div className="bg-emerald-50/50 rounded-[40px] border border-emerald-100 p-8 shadow-sm group hover:shadow-md transition-all">
           <div className="flex justify-between items-start mb-6">
              <h3 className="font-display text-lg font-bold text-[#0F172A]">Customer Info</h3>
              <div className="h-12 w-12 rounded-2xl bg-white border border-emerald-100 flex items-center justify-center text-emerald-500 shadow-sm">
                 <User size={20} />
              </div>
           </div>
           <div className="space-y-1 text-sm">
              <p className="font-bold text-[#0F172A] text-base">{user.firstName} {user.lastName}</p>
              <p className="text-slate-500">{user.email}</p>
              <p className="text-slate-500">Phone: {user.phone}</p>
           </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-blue-50/50 rounded-[40px] border border-blue-100 p-8 shadow-sm group hover:shadow-md transition-all">
           <div className="flex justify-between items-start mb-6">
              <h3 className="font-display text-lg font-bold text-[#0F172A]">Shipping Address</h3>
              <div className="h-12 w-12 rounded-2xl bg-white border border-blue-100 flex items-center justify-center text-blue-500 shadow-sm">
                 <MapPin size={20} />
              </div>
           </div>
           <div className="space-y-1 text-sm text-slate-600 leading-relaxed">
              <p className="font-bold text-[#0F172A]">{address.houseNo}, {address.street}</p>
              <p>{address.landmark}</p>
              <p>{address.city}, {address.state} - {address.postalCode}</p>
              <p>{address.country}</p>
           </div>
        </div>

        {/* Billing Address */}
        <div className="bg-slate-50 rounded-[40px] border border-slate-100 p-8 shadow-sm group hover:shadow-md transition-all">
           <div className="flex justify-between items-start mb-6">
              <h3 className="font-display text-lg font-bold text-[#0F172A]">Billing Address</h3>
              <div className="h-12 w-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 shadow-sm">
                 <FileText size={20} />
              </div>
           </div>
           <div className="space-y-1 text-sm text-slate-600 leading-relaxed">
              <p className="font-bold text-[#0F172A]">{address.houseNo}, {address.street}</p>
              <p>{address.landmark}</p>
              <p>{address.city}, {address.state} - {address.postalCode}</p>
              <p>{address.country}</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Main Content: Items Table */}
        <div className="lg:col-span-8 space-y-10">
           <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50/10 border-b border-slate-50">
                        <th className="p-6 font-ui text-[10px] uppercase tracking-widest text-slate-400">Product ID</th>
                        <th className="p-6 font-ui text-[10px] uppercase tracking-widest text-slate-400">Product Name</th>
                        <th className="p-6 font-ui text-[10px] uppercase tracking-widest text-slate-400">Amount</th>
                        <th className="p-6 font-ui text-[10px] uppercase tracking-widest text-slate-400">Quantity</th>
                        <th className="p-6 font-ui text-[10px] uppercase tracking-widest text-slate-400 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                       {items.map((item: any) => (
                          <tr key={item.id} className="group hover:bg-slate-50/30 transition-colors">
                             <td className="p-6 text-xs font-bold text-blue-500">#{item.id.slice(-5).toUpperCase()}</td>
                             <td className="p-6">
                                <div className="flex items-center gap-4">
                                   <div className="h-10 w-10 bg-slate-100 rounded-lg overflow-hidden border border-slate-100 shrink-0">
                                      {item.product?.images?.[0] && <img src={item.product.images[0].url} className="w-full h-full object-cover" />}
                                   </div>
                                   <p className="font-display font-medium text-[#0F172A] text-sm">{item.name}</p>
                                </div>
                             </td>
                             <td className="p-6 text-sm text-slate-500">{formatMoney(item.price)}</td>
                             <td className="p-6 text-xs text-slate-400 font-bold uppercase tracking-widest">{item.quantity} PCS</td>
                             <td className="p-6 text-right font-display font-bold text-[#0F172A]">{formatMoney(item.total)}</td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
              <div className="p-10 border-t border-slate-50 bg-slate-50/20">
                 <div className="ml-auto max-w-xs space-y-4">
                    <div className="flex justify-between items-center text-sm">
                       <span className="text-slate-400 uppercase tracking-widest text-[10px] font-bold">Subtotal:</span>
                       <span className="font-bold text-[#0F172A]">{formatMoney(order.subtotal)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                       <span className="text-slate-400 uppercase tracking-widest text-[10px] font-bold">Shipping Charge:</span>
                       <span className="font-bold text-[#0F172A]">{formatMoney(order.shippingCharge)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                       <span className="text-slate-400 uppercase tracking-widest text-[10px] font-bold">Tax (GST):</span>
                       <span className="font-bold text-[#0F172A]">{formatMoney(order.tax)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                       <span className="text-slate-400 uppercase tracking-widest text-[10px] font-bold">Special Discount:</span>
                       <span className="font-bold text-rose-500">-{formatMoney(order.discount)}</span>
                    </div>
                    <div className="h-px bg-slate-200 my-4" />
                    <div className="flex justify-between items-center">
                       <span className="font-display font-bold text-[#0F172A]">Total (INR):</span>
                       <span className="font-display text-xl font-bold text-[#0F172A]">{formatMoney(order.total)}</span>
                    </div>
                 </div>
              </div>
           </div>
           {/* Timeline Section */}
           <div className="bg-white rounded-[40px] border border-slate-100 p-10 shadow-sm">
              <div className="flex justify-between items-center mb-12">
                 <h3 className="font-display text-xl font-bold text-[#0F172A]">Order Journey</h3>
                 <div className="flex gap-2">
                    <button className="px-4 py-2 bg-blue-50 text-blue-500 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-blue-100 transition-all"><Map size={14}/> Change Address</button>
                    <button className="px-4 py-2 bg-rose-50 text-rose-500 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-rose-100 transition-all"><XCircle size={14}/> Cancel Order</button>
                 </div>
              </div>

              <div className="px-4">
                 <OrderTracking 
                    steps={statuses.map((s, i) => ({
                       name: s,
                       timestamp: i <= currentStatusIdx ? new Date(order.createdAt).toLocaleDateString('en-GB') : 'Pending',
                       isCompleted: i <= currentStatusIdx
                    }))}
                 />
              </div>
           </div>

        </div>

        {/* Sidebar Widgets */}
        <aside className="lg:col-span-4 space-y-10">
           {/* Logistics Partner */}
           <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm">
              <div className="flex justify-between items-center mb-10">
                 <h3 className="font-display font-bold text-[#0F172A]">Logistics Details</h3>
                 <button className="px-4 py-2 bg-sky-50 text-sky-500 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-sky-500 hover:text-white transition-all">Track Order</button>
              </div>

              <div className="flex flex-col items-center text-center p-6 border border-slate-50 rounded-[32px] bg-slate-50/50 group">
                 <div className="h-16 w-16 bg-white rounded-[24px] shadow-sm flex items-center justify-center text-[#0F172A] mb-6 group-hover:scale-110 transition-transform">
                    <Truck size={32} />
                 </div>
                 <h4 className="font-display text-lg font-bold text-[#0F172A]">{order.shippingCarrier || 'Assign Carrier'}</h4>
                 <div className="mt-4 space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">ID: {order.trackingId || 'N/A'}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Payment Mode: {order.status === 'PAID' ? 'Digital Core' : 'Manual'}</p>
                 </div>
              </div>
           </div>

           {/* Payment Details */}
           <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm">
              <h3 className="font-display font-bold text-[#0F172A] mb-8">Transactions</h3>
              <div className="space-y-6">
                 <div className="flex justify-between items-center">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Transaction Ref:</span>
                    <span className="text-[11px] font-bold text-blue-500">#{order.id.slice(0, 10).toUpperCase()}</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Method:</span>
                    <span className="flex items-center gap-2 text-sm font-bold text-[#0F172A]">
                       <CreditCard size={14} className="text-slate-400" /> Cashfree UPI
                    </span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Payer Name:</span>
                    <span className="text-sm font-bold text-[#0F172A]">{user.firstName} {user.lastName}</span>
                 </div>
                 <div className="h-px bg-slate-50" />
                 <div className="flex justify-between items-center">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Total Charged:</span>
                    <span className="text-lg font-bold text-[#0F172A]">{formatMoney(order.total)}</span>
                 </div>
              </div>
           </div>

           {/* Support Widget */}
           <div className="bg-[#0F172A] rounded-[40px] p-8 text-white relative overflow-hidden group shadow-2xl">
              <div className="absolute -right-4 -top-4 h-32 w-32 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all" />
              <div className="relative z-10">
                 <div className="h-12 w-12 bg-[#D4AF37] rounded-2xl flex items-center justify-center text-white mb-6">
                    <AlertCircle size={24} />
                 </div>
                 <h3 className="font-display text-xl font-bold mb-2">Internal Support</h3>
                 <p className="text-white/40 text-xs leading-relaxed mb-8">Need to manage a complex return or issue? Connect with the logistics desk.</p>
                 <button className="w-full py-4 bg-white text-[#0F172A] rounded-2xl font-ui text-[11px] font-bold uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center justify-center gap-2">
                    Open Ticket
                 </button>
              </div>
           </div>
        </aside>

      </div>
    </div>
  );
}
