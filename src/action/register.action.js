"use server";

import { registerService } from "@/service/auth.service";
import { redirect } from "next/navigation";

export const registerAction = async (userData) => {
  try {
    const result = await registerService(userData);

    if (result && !result.success) {
      return {
        success: false,
        message: result.message || "Registration failed",
      };
    }
  } catch (error) {
    if (error.digest?.includes("NEXT_REDIRECT")) {
      throw error;
    }
    return {
      success: false,
      message: "Server error. Please try again.",
    };
  }
  redirect("/login");
};
