"use server";

import { registerService } from "@/service/auth.service";
import { redirect } from "next/navigation";

export const registerAction = async (userData) => {
  try {
    const result = await registerService(userData);

    if (!result.success) {
      return {
        success: false,
        message: result.message || "Registration failed",
      };
    }

    redirect("/login");
  } catch (error) {
    return {
      success: false,
      message: "Server error. Please try again.",
    };
  }
};
