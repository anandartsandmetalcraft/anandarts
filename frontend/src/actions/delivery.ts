"use server";

import { checkShiprocketServiceability } from "@/lib/shiprocket";

export async function estimateDeliveryAction(pincode: string, weightGrams: number = 1000) {
  if (!pincode || pincode.length !== 6) {
    return { error: "Please enter a valid 6-digit PIN code." };
  }

  // Basic format check
  if (!/^\d{6}$/.test(pincode)) {
    return { error: "PIN code must contain only numbers." };
  }

  try {
    const result = await checkShiprocketServiceability(pincode, weightGrams);
    
    if (!result) {
      return { error: "Could not fetch delivery estimation. Please try again later." };
    }

    if (!result.isServiceable) {
      return { error: "Sorry, we do not deliver to this PIN code at the moment." };
    }

    // Format the date nicely
    const eddDate = new Date(result.edd);
    const formattedDate = eddDate.toLocaleDateString('en-IN', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });

    return { 
      success: true, 
      estimatedDays: result.estimatedDays,
      formattedDate: formattedDate
    };
  } catch (error) {
    console.error("Delivery Estimation Error:", error);
    return { error: "An unexpected error occurred." };
  }
}
