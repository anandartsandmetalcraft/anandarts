"use server";

import { ActivityType, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";

export type ActivityInput = {
  type: ActivityType;
  title: string;
  description: string;
  href?: string | null;
  referenceId?: string | null;
  metadata?: Prisma.InputJsonValue | null;
};

export async function logActivity(input: ActivityInput) {
  try {
    await db.activityLog.create({
      data: {
        type: input.type,
        title: input.title,
        description: input.description,
        href: input.href ?? null,
        referenceId: input.referenceId ?? null,
        metadata: input.metadata ?? undefined,
      },
    });

    revalidatePath("/admin");
    revalidatePath("/admin/activity");
    return { success: true };
  } catch (error) {
    console.error("Activity log error:", error);
    return { error: "Unable to write activity log." };
  }
}

export async function getAdminActivityFeed(limit = 12) {
  const [activities, unreadCount] = await Promise.all([
    db.activityLog.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
    }),
    db.activityLog.count({
      where: { isRead: false },
    }),
  ]);

  return {
    activities,
    unreadCount,
  };
}

export async function markActivitiesRead(ids: string[]) {
  if (!ids.length) {
    return { success: true };
  }

  await db.activityLog.updateMany({
    where: { id: { in: ids } },
    data: { isRead: true },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/activity");
  return { success: true };
}
