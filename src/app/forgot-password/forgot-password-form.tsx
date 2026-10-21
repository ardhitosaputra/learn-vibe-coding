"use client";

import { useActionState, useEffect } from "react";
import Link from "next/link";
import { forgotPasswordAction } from "@/actions/auth";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Loader2, AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export function ForgotPasswordForm() {
  const [state, formAction, isPending] = useActionState(forgotPasswordAction, null);

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message || "Tautan reset telah dikirim!");
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <Card className="border border-border/60 bg-card/70 backdrop-blur-xl shadow-xl ring-1 ring-border/20">
      <CardContent className="pt-6">
        {state?.success ? (
          <div className="py-6 text-center space-y-4">
            <div className="size-14 rounded-full bg-emerald-500/10 text-emerald-500 mx-auto flex items-center justify-center">
              <CheckCircle2 className="size-8" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Periksa Email Anda</h2>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
              {state.message}
            </p>
            <div className="pt-4">
              <Link
                href="/login"
                className={buttonVariants({ variant: "outline", className: "w-full" })}
              >
                <ArrowLeft className="size-4 mr-2" /> Kembali ke Halaman Masuk
              </Link>
            </div>
          </div>
        ) : (
          <form action={formAction} className="space-y-4">
            {state?.error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-start gap-2.5">
                <AlertCircle className="size-4 shrink-0 mt-0.5" />
                <span>{state.error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="text-xs font-semibold text-foreground tracking-wide uppercase"
              >
                Email Terdaftar
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

            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-11 font-semibold text-sm shadow-md transition-all mt-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-2" />
                  Mengirim Tautan...
                </>
              ) : (
                "Kirim Tautan Reset Sandi"
              )}
            </Button>

            <div className="text-center pt-2">
              <Link
                href="/login"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition"
              >
                <ArrowLeft className="size-4 mr-1.5" /> Kembali ke Masuk
              </Link>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
