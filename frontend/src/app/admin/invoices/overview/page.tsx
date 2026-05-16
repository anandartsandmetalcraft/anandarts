import { redirect } from "next/navigation";
import { getAllAdminOrders } from "@/actions/admin";

export default async function InvoiceOverviewRedirect() {
  // Use the established action instead of direct DB access
  // to ensure consistent administrative security and error handling.
  const res = await getAllAdminOrders(1, 1);

  if (!res.success || !res.orders || res.orders.length === 0) {
    redirect("/admin/invoices");
  }

  redirect(`/admin/invoices/${res.orders[0].id}`);
}
