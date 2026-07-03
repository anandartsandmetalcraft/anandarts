import React from "react";
import { AdminDashboardSkeleton } from "@/components/shared/Skeleton";

export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-slate-50/50 p-8 pt-24">
      <AdminDashboardSkeleton />
    </div>
  );
}
