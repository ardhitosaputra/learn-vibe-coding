"use client";

import { useActionState, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signupAction, type AuthResult } from "@/actions/auth";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Lock, User, Phone, Eye, EyeOff, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export function RegisterForm({ redirectTo }: { redirectTo?: string }) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction, isPending] = useActionState(signupAction, null);

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message || "Pendaftaran berhasil!");
      if (state.redirectUrl) {
        router.push(state.redirectUrl);
        router.refresh();
      }
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state, router]);

  return (
    <Card className="border border-border/60 bg-card/70 backdrop-blur-xl shadow-xl ring-1 ring-border/20">
      <CardContent className="pt-6">
        {state?.success && !state.redirectUrl ? (
          <div className="py-8 text-center space-y-4">
            <div className="size-14 rounded-full bg-emerald-500/10 text-emerald-500 mx-auto flex items-center justify-center">
              <CheckCircle2 className="size-8" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Verifikasi Email Anda</h2>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
              {state.message}
            </p>
            <div className="pt-4">
              <Link
                href="/login"
                className={buttonVariants({ variant: "outline", className: "w-full" })}
              >
                Kembali ke Halaman Masuk
              </Link>
            </div>
          </div>
        ) : (
          <form action={formAction} className="space-y-4">
            {/* Error banner */}
            {state?.error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-start gap-2.5">
                <AlertCircle className="size-4 shrink-0 mt-0.5" />
                <span>{state.error}</span>
              </div>
            )}

            {/* Full Name input */}
            <div className="space-y-1.5">
              <label
                htmlFor="fullName"
                className="text-xs font-semibold text-foreground tracking-wide uppercase"
              >
                Nama Lengkap
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="Contoh: Budi Pratama"
                  required
                  autoComplete="name"
                  className="pl-9 h-11 bg-background/50 border-input/60 focus-visible:bg-background transition"
                />
              </div>
            </div>

            {/* Email input */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="text-xs font-semibold text-foreground tracking-wide uppercase"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="nama@email.com"
                  required
                  autoComplete="email"
                  className="pl-9 h-11 bg-background/50 border-input/60 focus-visible:bg-background transition"
                />
              </div>
            </div>

            {/* Phone Number input */}
            <div className="space-y-1.5">
              <label
                htmlFor="phone"
                className="text-xs font-semibold text-foreground tracking-wide uppercase"
              >
                Nomor Telepon / WhatsApp <span className="text-muted-foreground font-normal lowercase">(opsional)</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="081234567890"
                  autoComplete="tel"
                  className="pl-9 h-11 bg-background/50 border-input/60 focus-visible:bg-background transition"
                />
              </div>
            </div>

            {/* Password input */}
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="text-xs font-semibold text-foreground tracking-wide uppercase"
              >
                Kata Sandi
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Minimal 6 karakter"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  className="pl-9 pr-10 h-11 bg-background/50 border-input/60 focus-visible:bg-background transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition p-1"
                  aria-label={showPassword ? "Sembunyikan password" : "Lihat password"}
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password input */}
            <div className="space-y-1.5">
              <label
                htmlFor="confirmPassword"
                className="text-xs font-semibold text-foreground tracking-wide uppercase"
              >
                Konfirmasi Kata Sandi
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Ulangi kata sandi"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  className="pl-9 pr-10 h-11 bg-background/50 border-input/60 focus-visible:bg-background transition"
                />
              </div>
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-11 font-semibold text-sm shadow-md transition-all mt-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-2" />
                  Mendaftarkan Akun...
                </>
              ) : (
                "Daftar Akun Baru"
              )}
            </Button>

            {/* Login switch link */}
            <div className="text-center pt-2 text-sm text-muted-foreground">
              Sudah memiliki akun?{" "}
              <Link
                href={redirectTo ? `/login?redirectTo=${encodeURIComponent(redirectTo)}` : "/login"}
                className="text-foreground font-semibold hover:text-primary transition underline underline-offset-4"
              >
                Masuk di Sini
              </Link>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
