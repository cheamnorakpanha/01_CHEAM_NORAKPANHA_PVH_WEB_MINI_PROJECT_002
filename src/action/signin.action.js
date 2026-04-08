"use server";

import { signIn } from "@/libs/auth";

export const signInAction = async (formData) => {
  try {
    const email = formData.get("email");
    const password = formData.get("password");

    if (!email || !password) {
      return {
        success: false,
        message: "Email and password are required",
      };
    }

    await signIn("credentials", {
      email,
      password,
      redirectTo: "/",
    });

    return { success: true };
  } catch (error) {
    console.error("Login error:", error);

    return {
      success: false,
      message: "Invalid credentials",
    };
  }
};
