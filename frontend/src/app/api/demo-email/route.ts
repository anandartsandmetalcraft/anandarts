import { generateOrderConfirmationEmail } from "@/lib/emailTemplates";
import { NextResponse } from "next/server";

export async function GET() {
  // Dummy order data to showcase the design
  const dummyOrder = {
    orderNumber: "AA-20260425-0899",
    customerName: "Jaishankar G",
    date: new Date().toLocaleDateString("en-IN", { day: 'numeric', month: 'long', year: 'numeric' }),
    subtotal: 1250000, // ₹12,500.00
    tax: 225000,       // ₹2,250.00
    shippingCharge: 0, // ₹0.00
    total: 1475000,    // ₹14,750.00
    isPickup: true,    // Toggle this to false in the code to see the delivery version!
    address: "Jaishankar G\nNo. 42, Heritage Lane\nMalleswaram\nBengaluru, Karnataka 560003",
    trackingLink: "https://www.anandartsandmetalcrafts.com/track-order",
    items: [
      {
        name: "Brass Nataraja Masterpiece (24 inch)",
        quantity: 1,
        price: 1250000,
        image: "https://images.unsplash.com/photo-1614725916035-717a61d15be8?auto=format&fit=crop&w=200&q=80"
      }
    ]
  };

  const html = generateOrderConfirmationEmail(dummyOrder);

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html",
    },
  });
}
