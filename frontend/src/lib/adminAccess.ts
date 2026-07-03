import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export function isDevAdminBypassEnabled() {
  return process.env.ADMIN_DEV_BYPASS === "true";
}

export async function getAdminContext() {
  if (isDevAdminBypassEnabled()) {
    return { allowed: true as const, bypass: true as const, userId: "dev-admin" };
  }

  const session = await auth();
  if (!session?.user?.id) {
    return { allowed: false as const, bypass: false as const, reason: "unauthenticated" as const };
  }

  if (
    session.user.role === "ADMIN" &&
    (session.user.adminSessionExpired ||
      (session.user.adminSessionExpiresAt && Date.now() > session.user.adminSessionExpiresAt))
  ) {
    return { allowed: false as const, bypass: false as const, reason: "expired" as const };
  }

  const dbUser = await db.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (dbUser?.role !== "ADMIN") {
    return { allowed: false as const, bypass: false as const, reason: "forbidden" as const };
  }

  return { allowed: true as const, bypass: false as const, userId: session.user.id };
}
