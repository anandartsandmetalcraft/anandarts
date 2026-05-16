import { getAdminContext } from "@/lib/adminAccess";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";
import AdminLayoutClient from "@/components/admin/AdminLayoutClient";
 
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getAdminContext();

  if (!admin.allowed) {
    redirect(`/admin-login${admin.reason === "forbidden" ? "?reason=forbidden" : ""}`);
  }

  return (
    <div className="min-h-screen bg-[#FBFAF5] flex">
      <div className="print:hidden">
        <AdminSidebar />
      </div>
      <AdminLayoutClient>
        <div className="p-6 md:px-10 md:py-8 lg:p-12 print:p-0 print:m-0">
          <div className="print:hidden">
            <AdminTopbar />
          </div>
          {admin.bypass && (
            <div className="mb-6 rounded-2xl border border-amber-300 bg-amber-50 px-5 py-4 font-ui text-[11px] font-bold uppercase tracking-widest text-amber-900 print:hidden">
              Development admin bypass is active locally.
            </div>
          )}
          {children}
        </div>
      </AdminLayoutClient>
    </div>
  );
}
