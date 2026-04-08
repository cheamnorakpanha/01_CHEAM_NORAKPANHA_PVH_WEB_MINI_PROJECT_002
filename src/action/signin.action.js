"use server";

import { signIn } from "@/libs/auth";

export const signInAction = async (formData) => {
  await signIn("credentials", {
    email: formData.get("email"),
    password: formData.get("password"),
    redirectTo: "/",
  });
};
