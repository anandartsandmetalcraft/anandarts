"use server";

import { db } from "@/lib/db";
import { getAdminContext } from "@/lib/adminAccess";

export async function getAdminCategories() {
  const admin = await getAdminContext();
  if (!admin.allowed) return { error: "Access Denied" as const, categories: [] as any[] };

  const categories = await db.category.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return { categories };
}

