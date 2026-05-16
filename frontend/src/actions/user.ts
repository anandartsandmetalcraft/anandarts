"use server";
 
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { userSchema, type UserUpdateInput } from "@/lib/validations";
import { revalidatePath } from "next/cache";
 
/**
 * UPDATE CURATOR PROFILE
 */
export async function updateProfile(data: UserUpdateInput) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Please log in to update your profile." };
  }
 
  const parsed = userSchema.partial().safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }
 
  try {
    const updatedUser = await db.user.update({
      where: { id: session.user.id },
      data: parsed.data,
    });
 
    revalidatePath("/account");
    return { success: true, user: updatedUser };
  } catch (error: any) {
    console.error("Profile Update Error:", error);
    return { error: "An unexpected disturbance occurred while updating your record." };
  }
}

/**
 * GET OPTIMIZED USER SESSION INFO (Optimized for Navbar)
 * Minimizes payload by selecting only 4 small fields.
 */
export async function getUserSessionInfo() {
  const session = await auth();
  if (!session?.user?.id) return null;

  try {
    return await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        firstName: true,
        image: true,
        role: true,
      },
    });
  } catch (error) {
    console.error("Optimized user fetch failed:", error);
    return null;
  }
}
