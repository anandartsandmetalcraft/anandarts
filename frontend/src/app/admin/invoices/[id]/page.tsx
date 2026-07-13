import React from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowLeft, 
  Download, 
  ChevronRight,
  Info
} from "lucide-react";
import { getAdminOrderById } from "@/actions/admin";
import InvoicePrintButton from "./InvoicePrintButton";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value / 100);
}

export default async function InvoiceDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const res = await getAdminOrderById(id);

  if (!res.success || !res.order) {
    return (
      <div className="p-12 text-center bg-white rounded-[40px] border border-slate-100 min-h-[400px] flex flex-col items-center justify-center">
         <h1 className="text-xl font-bold text-[#0F172A] font-display">Invoice not found</h1>
         <Link href="/admin/invoices" className="text-blue-500 hover:underline mt-4 inline-block text-[11px] font-bold uppercase tracking-widest font-ui">Back to list</Link>
      </div>
    );
  }

  const { order } = res;
  const { user, address, items } = order;
  const invoiceNumber = (order as any).invoice?.invoiceNumber || order.orderNumber;
  const invoiceChannel = (order as any).invoice?.channel || (order.notes === "STORE_PICKUP" ? "STORE" : "WEBSITE");

  return (
    <div className="space-y-10 pb-32 print:p-0 font-display">
      <style>{`
        @media print {
          @page { size: A4; margin: 0 !important; }
          body { -webkit-print-color-adjust: exact; margin: 0 !important; padding: 0 !important; }
          html, body { height: 100%; border: 1px solid transparent; }
          .admin-sidebar, .admin-topbar, .bypass-alert, .no-print, header, footer { display: none !important; }
          .print-container { padding: 15mm !important; margin: 0 !important; }
        }
      `}</style>
      
      {/* Breadcrumb Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-4">
        <div>
          <h1 className="text-[13px] font-bold text-[#0F172A] uppercase tracking-wider mb-2">Invoice Details</h1>
        </div>
        <div className="flex items-center gap-2">
            <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Invoices</span>
            <ChevronRight size={12} className="text-slate-300" />
            <span className="text-slate-700 font-bold uppercase tracking-widest text-[10px]">Invoice Details</span>
        </div>
      </div>

      {/* Main Professional Invoice Body */}
      <div className="bg-white rounded-[8px] border border-slate-100 shadow-sm overflow-hidden min-h-screen max-w-6xl mx-auto">
         
         {/* Part 1: Company Header (Image 1 Style) */}
         <div className="p-12 border-b border-slate-50 flex flex-col md:flex-row justify-between gap-12">
            <div className="space-y-8">
               <div className="flex items-center gap-6">
                  <div className="relative h-20 w-80">
                    <Image
                      src="/Logo3.png"
                      alt="Anand Arts Logo"
                      fill
                      className="object-contain object-left"
                      priority
                    />
                  </div>
               </div>
               <div className="space-y-3">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Address</p>
                  <p className="text-[13px] text-slate-500 leading-relaxed font-ui font-bold">
                    2/4, 10th 'A, Laxmi Narayanpuram,<br/>
                    Srirampura, Bengaluru, 560021
                  </p>
               </div>
            </div>
            <div className="text-left md:text-right space-y-1">
               <p className="text-[13px] text-slate-500 font-ui font-bold"><span className="text-slate-400 font-bold uppercase text-[10px] mr-2">GST Registration No:</span> 29PTJPS2898B1ZQ</p>
               <p className="text-[13px] text-slate-500 font-ui font-bold">Email: anandartsandmetalcraft@gmail.com</p>
               <p className="text-[13px] text-slate-500 font-ui font-bold underline">Website: www.anandartsandmetalcrafts.com</p>
               <p className="text-[13px] text-slate-500 font-ui font-bold">Contact No: +91 84318 38722</p>
            </div>
         </div>

         {/* Part 2: Quick Info Bar (Image 1 Style) */}
         <div className="px-12 py-10 border-b border-slate-50 flex flex-wrap gap-12 md:gap-24">
            <div className="space-y-1">
               <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Invoice No</p>
               <p className="text-[15px] font-bold text-[#0F172A]">{invoiceNumber}</p>
               <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">
                 {invoiceChannel === "STORE" ? "🏪 Store Invoice" : "🌐 Website Invoice"}
               </p>
            </div>
            <div className="space-y-1">
               <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Order Ref</p>
               <p className="text-[13px] font-bold text-slate-500">{order.orderNumber}</p>
            </div>
            <div className="space-y-1">
               <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Date</p>
               <p className="text-[13px] font-bold text-slate-500">
                  {new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} 
                  <span className="ml-2 font-normal text-slate-400">{new Date(order.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
               </p>
            </div>
            <div className="space-y-2">
               <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Payment Status</p>
               <span className="px-3 py-1 bg-emerald-50 text-emerald-500 border border-emerald-100 rounded text-[10px] font-bold uppercase tracking-widest leading-none block w-fit">Paid</span>
            </div>
            <div className="space-y-1">
               <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Total Amount</p>
               <p className="text-[18px] font-bold text-[#0F172A]">{formatCurrency(order.total)}</p>
            </div>
         </div>

         {/* Part 3: Addresses Split (Image 1 Style) */}
         <div className="px-12 py-10 flex flex-col md:flex-row gap-12 md:gap-40 border-b border-slate-50">
            <div className="space-y-5">
               <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Billing Address</p>
               <div className="space-y-1.5">
                  <h4 className="font-bold text-[#0F172A] text-[15px]">{user.firstName} {user.lastName}</h4>
                  <p className="text-[13px] text-slate-500 font-ui leading-loose">
                     {address.houseNo}, {address.street}, {address.city}<br/>
                     {address.state} - {address.postalCode}
                  </p>
                  <p className="text-[13px] text-slate-500">Phone: {user.phone}</p>
                  <p className="text-[13px] text-slate-500">Tax: 65-498700</p>
               </div>
            </div>
            <div className="space-y-5">
               <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Shipping Address</p>
               <div className="space-y-1.5">
                  <h4 className="font-bold text-[#0F172A] text-[15px]">{user.firstName} {user.lastName}</h4>
                  <p className="text-[13px] text-slate-500 font-ui leading-loose">
                     {address.houseNo}, {address.street}, {address.city}<br/>
                     {address.state} - {address.postalCode}
                  </p>
                  <p className="text-[13px] text-slate-500">Phone: {user.phone}</p>
               </div>
            </div>
         </div>

         {/* Part 4: Products Table (Image 2 Style) */}
         <div className="p-12">
            <div className="overflow-hidden rounded-md border border-slate-50">
               <table className="w-full text-left">
                  <thead className="bg-[#F8F9FA] border-b border-slate-100">
                     <tr>
                        <th className="p-4 w-16 text-center text-slate-700 font-bold border-r border-slate-100 italic font-display">#</th>
                        <th className="p-4 text-slate-700 font-bold uppercase tracking-wider text-[11px] text-center">Product Details</th>
                        <th className="p-4 w-32 text-slate-700 font-bold uppercase tracking-wider text-[11px] text-center">Rate</th>
                        <th className="p-4 w-32 text-slate-700 font-bold uppercase tracking-wider text-[11px] text-center">Quantity</th>
                        <th className="p-4 w-32 text-slate-700 font-bold uppercase tracking-wider text-[11px] text-center">Amount</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                     {items.map((item: any, idx: number) => (
                        <tr key={item.id} className="text-[13px]">
                           <td className="p-6 text-center font-bold text-slate-700 border-r border-slate-50">{String(idx + 1).padStart(2, '0')}</td>
                           <td className="p-6">
                              <p className="font-bold text-[#0F172A] text-[15px] mb-1">{item.product?.name || item.name}</p>
                              <p className="text-slate-400 text-[12px]">{item.material || 'Handcrafted Metal Finish'}</p>
                           </td>
                           <td className="p-6 text-center font-ui text-slate-500 font-medium">{formatCurrency(item.price)}</td>
                           <td className="p-6 text-center font-ui text-slate-500 font-medium">{String(item.quantity).padStart(2, '0')}</td>
                           <td className="p-6 text-center font-bold text-[#0F172A]">{formatCurrency(item.total)}</td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>

             {/* Part 5: Financial Breakdown (Image 2 Style) */}
             <div className="mt-1 flex flex-col items-end">
                <div className="w-[300px] divide-y divide-dashed divide-slate-100">
                   <div className="p-4 flex justify-between items-center text-[13px]">
                      <span className="text-slate-500 font-medium">Sub Total</span>
                      <span className="font-bold text-[#0F172A]">{formatCurrency(order.subtotal)}</span>
                   </div>
                   <div className="p-4 flex justify-between items-center text-[13px]">
                      <span className="text-slate-500 font-medium">Estimated Tax (12.5%)</span>
                      <span className="font-bold text-[#0F172A]">{formatCurrency(order.subtotal * 0.125)}</span>
                   </div>
                   <div className="p-4 flex justify-between items-center text-[13px]">
                      <span className="text-slate-500 font-medium whitespace-nowrap">Discount <span className="text-slate-400 font-normal ml-1">({Math.round((order.discount/order.subtotal)*100)}%)</span></span>
                      <span className="font-bold text-rose-500">-{formatCurrency(order.discount)}</span>
                   </div>
                   <div className="p-4 flex justify-between items-center text-[13px]">
                      <span className="text-slate-500 font-medium">Shipping Charge</span>
                      <span className="font-bold text-[#0F172A]">{formatCurrency(order.shippingCharge)}</span>
                   </div>
                   <div className="p-6 flex justify-between items-center border-t-2 border-slate-100 bg-slate-50/20">
                      <span className="text-[15px] font-bold text-[#0F172A]">Total Amount</span>
                      <span className="text-[18px] font-bold text-[#0F172A]">{formatCurrency(order.total)}</span>
                   </div>
                </div>
             </div>
 
             {/* Part 6: Payment Details & Notes (Image 3 Style) */}
             <div className="mt-12 space-y-10">
                <div className="space-y-3">
                   <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Payment Status & Channel:</p>
                   <div className="space-y-1 text-[13px] text-slate-500 font-ui leading-loose">
                      <p><span className="text-slate-400 font-medium">Channel:</span> POS Terminal / Online UPI</p>
                      <p><span className="text-slate-400 font-medium">Auth Status:</span> VERIFIED</p>
                      <p><span className="text-slate-400 font-medium">Payee:</span> {user.firstName} {user.lastName}</p>
                      <p><span className="text-slate-400 font-medium font-bold text-emerald-500 uppercase tracking-widest">Status: PAID</span></p>
                   </div>
                </div>
 
                <div className="bg-[#FFFBEB] border border-[#FEF3C7] rounded-[6px] p-6 text-[#92400E] text-[13px] leading-relaxed font-ui">
                   <p><span className="font-bold uppercase tracking-wider mr-2">Payment Terms:</span> All invoices are due within 7 days. We accept UPI, credit cards, and direct bank transfers. Overdue accounts may be subject to additional fees as per the original quote.</p>
                </div>
                
                {/* Final Action Buttons (Image 3 Style) */}
                <div className="flex justify-end gap-3 pt-6 print:hidden">
                   <InvoicePrintButton />
                   <button className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-[6px] text-[11px] font-bold uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-blue-500/10"><Download size={16}/> Download PDF</button>
                </div>
            </div>
         </div>
      </div>

    </div>
  );
}
