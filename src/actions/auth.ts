"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/db";
import { profiles } from "@/db/schema/profiles";
import { eq } from "drizzle-orm";

export type AuthResult = {
  success: boolean;
  message?: string;
  error?: string;
  redirectUrl?: string;
};

export async function loginAction(
  prevState: AuthResult | null,
  formData: FormData
): Promise<AuthResult> {
  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;
  const redirectTo = (formData.get("redirectTo") as string) || "/";

  if (!email || !password) {
    return {
      success: false,
      error: "Email dan kata sandi wajib diisi.",
    };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    let errorMessage = "Gagal masuk. Periksa kembali email dan password Anda.";
    if (error.message.includes("Invalid login credentials")) {
      errorMessage = "Email atau kata sandi tidak sesuai.";
    } else if (error.message.includes("Email not confirmed")) {
      errorMessage = "Email belum diverifikasi. Silakan periksa inbox email Anda.";
    }
    return {
      success: false,
      error: errorMessage,
    };
  }

  if (data.user) {
    // Ensure profile exists in profiles table
    try {
      const existing = await db
        .select()
        .from(profiles)
        .where(eq(profiles.id, data.user.id))
        .limit(1);

      if (existing.length === 0) {
        await db.insert(profiles).values({
          id: data.user.id,
          email: data.user.email || email,
          fullName: (data.user.user_metadata?.full_name as string) || null,
          phone: (data.user.user_metadata?.phone as string) || null,
          role: "customer",
        });
      }
    } catch (e) {
      console.warn("⚠️ Warning: Profile sync error during login:", e);
    }
  }

  revalidatePath("/", "layout");
  return {
    success: true,
    redirectUrl: redirectTo,
  };
}

export async function signupAction(
  prevState: AuthResult | null,
  formData: FormData
): Promise<AuthResult> {
  const fullName = (formData.get("fullName") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const phone = (formData.get("phone") as string)?.trim() || null;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!fullName || !email || !password) {
    return {
      success: false,
      error: "Nama lengkap, email, dan kata sandi wajib diisi.",
    };
  }

  if (password.length < 6) {
    return {
      success: false,
      error: "Kata sandi minimal 6 karakter.",
    };
  }

  if (password !== confirmPassword) {
    return {
      success: false,
      error: "Konfirmasi kata sandi tidak cocok.",
    };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        phone: phone,
      },
    },
  });

  if (error) {
    let errorMessage = error.message;
    if (error.message.includes("User already registered")) {
      errorMessage = "Email ini sudah terdaftar. Silakan login ke akun Anda.";
    }
    return {
      success: false,
      error: errorMessage,
    };
  }

  if (data.user) {
    try {
      await db
        .insert(profiles)
        .values({
          id: data.user.id,
          email: data.user.email || email,
          fullName: fullName,
          phone: phone,
          role: "customer",
        })
        .onConflictDoNothing();
    } catch (e) {
      console.warn("⚠️ Warning: Profile sync error during signup:", e);
    }
  }

  revalidatePath("/", "layout");

  // Check if session exists (auto-confirm is enabled in Supabase) or requires email confirmation
  if (data.session) {
    return {
      success: true,
      message: "Akun berhasil dibuat! Mengalihkan...",
      redirectUrl: "/",
    };
  }

  return {
    success: true,
    message:
      "Pendaftaran berhasil! Silakan periksa inbox email Anda untuk memverifikasi akun.",
  };
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}

export async function forgotPasswordAction(
  prevState: AuthResult | null,
  formData: FormData
): Promise<AuthResult> {
  const email = (formData.get("email") as string)?.trim();

  if (!email) {
    return {
      success: false,
      error: "Email wajib diisi.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email);

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  return {
    success: true,
    message: "Tautan reset kata sandi telah dikirim ke email Anda.",
  };
}

export async function getCurrentUser() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    // Fetch user profile from database
    const profile = await db
      .select()
      .from(profiles)
      .where(eq(profiles.id, user.id))
      .limit(1);

    return {
      user,
      profile: profile[0] || null,
    };
  } catch (error: any) {
    if (error?.digest || error?.message?.includes("prerender") || error?.digest === "HANGING_PROMISE_REJECTION") {
      throw error;
    }
    console.error("Failed to get current user:", error);
    return null;
  }
}
