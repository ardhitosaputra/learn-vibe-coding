"use client";

import { useActionState, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginAction, type AuthResult } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export function LoginForm({
  redirectTo,
  initialError,
}: {
  redirectTo?: string;
  initialError?: string;
}) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction, isPending] = useActionState(loginAction, null);

  useEffect(() => {
    if (initialError === "unauthorized") {
      toast.error("Akses ditolak: Anda harus login sebagai admin untuk membuka halaman tersebut.");
    } else if (initialError === "auth-callback-failed") {
      toast.error("Gagal memverifikasi sesi login. Silakan coba masuk kembali.");
    }
  }, [initialError]);

  useEffect(() => {
    if (state?.success) {
      toast.success("Berhasil masuk! Selamat berbelanja.");
      router.push(state.redirectUrl || redirectTo || "/");
      router.refresh();
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state, router, redirectTo]);

  return (
    <Card className="border border-border/60 bg-card/70 backdrop-blur-xl shadow-xl ring-1 ring-border/20">
      <CardContent className="pt-6">
        <form action={formAction} className="space-y-4">
          {redirectTo && (
            <input type="hidden" name="redirectTo" value={redirectTo} />
          )}

          {/* Form error notification */}
          {(state?.error || initialError) && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-start gap-2.5">
              <AlertCircle className="size-4 shrink-0 mt-0.5" />
              <span>
                {state?.error ||
                  (initialError === "unauthorized"
                    ? "Akses rute ini membutuhkan hak akses khusus."
                    : "Terjadi kesalahan autentikasi.")}
              </span>
            </div>
          )}

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

          {/* Password input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="text-xs font-semibold text-foreground tracking-wide uppercase"
              >
                Kata Sandi
              </label>
              <Link
                href="/forgot-password"
                className="text-xs text-primary hover:underline font-medium"
              >
                Lupa sandi?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                required
                autoComplete="current-password"
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

          {/* Submit button */}
          <Button
            type="submit"
            disabled={isPending}
            className="w-full h-11 font-semibold text-sm shadow-md transition-all mt-2"
          >
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin mr-2" />
                Memverifikasi...
              </>
            ) : (
              "Masuk ke Akun"
            )}
          </Button>

          {/* Register switch link */}
          <div className="text-center pt-2 text-sm text-muted-foreground">
            Belum memiliki akun?{" "}
            <Link
              href={redirectTo ? `/register?redirectTo=${encodeURIComponent(redirectTo)}` : "/register"}
              className="text-foreground font-semibold hover:text-primary transition underline underline-offset-4"
            >
              Daftar Sekarang
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
