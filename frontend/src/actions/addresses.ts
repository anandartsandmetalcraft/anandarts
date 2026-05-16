"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { addressSchema, type AddressInput } from "@/lib/validations";

// =============================================================
// GET USER ADDRESSES
// =============================================================

export async function getUserAddresses() {
  const session = await auth();
  if (!session?.user?.id) return [];

  return db.address.findMany({
    where: { userId: session.user.id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });
}

// =============================================================
// CREATE ADDRESS
// =============================================================

export async function createAddress(data: AddressInput) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const parsed = addressSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  // If this is set as default, unset others
  if (parsed.data.isDefault) {
    await db.address.updateMany({
      where: { userId: session.user.id },
      data: { isDefault: false },
    });
  }

  const address = await db.address.create({
    data: {
      ...parsed.data,
      userId: session.user.id,
    },
  });

  return { success: true, address };
}

// =============================================================
// UPDATE ADDRESS
// =============================================================

export async function updateAddress(addressId: string, data: Partial<AddressInput>) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  // Verify ownership
  const existing = await db.address.findFirst({
    where: { id: addressId, userId: session.user.id },
  });
  if (!existing) return { error: "Address not found" };

  if (data.isDefault) {
    await db.address.updateMany({
      where: { userId: session.user.id },
      data: { isDefault: false },
    });
  }

  const address = await db.address.update({
    where: { id: addressId },
    data,
  });

  return { success: true, address };
}

// =============================================================
// DELETE ADDRESS
// =============================================================

export async function deleteAddress(addressId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const existing = await db.address.findFirst({
    where: { id: addressId, userId: session.user.id },
  });
  if (!existing) return { error: "Address not found" };

  // Don't delete if used in orders
  const usedInOrders = await db.order.count({
    where: { addressId },
  });
  if (usedInOrders > 0) {
    return { error: "Cannot delete — address is linked to existing orders" };
  }

  await db.address.delete({ where: { id: addressId } });
  return { success: true };
}
