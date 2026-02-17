"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export async function SignIn(data: { password: string; email?: string }) {
  try {
    await signIn("credentials", {
      ...data,
      redirect: false,
    });
  } catch (error) {
    console.error("Signin error:", error);
    if (error instanceof AuthError) {
      throw new Error(error.cause?.err?.message);
    }

    console.error("Sign-in error:", error);
    throw error;
  }
}
