"use server";

import { signIn } from "@/app/auth";
import { LoginFormSchema } from "@/validations/login.schema";

export const signInAction = async (formData) => {
  try {
    const data = Object.fromEntries(formData.entries());
    const validatedFields = LoginFormSchema.safeParse(data);

    if (!validatedFields.success) {
      return {
        success: false,
        message: "Validation failed",
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const { email, password } = validatedFields.data;

    await signIn("credentials", {
      email,
      password,
      redirectTo: "/",
    });
  } catch (error) {
    if (error.message?.includes("NEXT_REDIRECT")) {
      throw error;
    }

    console.error("Login error:", error);

    return {
      success: false,
      message: "Invalid credentials",
    };
  }
};
