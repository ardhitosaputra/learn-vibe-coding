import { Suspense } from "react";
import Link from "next/link";
import { LoginForm } from "./login-form";

export const metadata = {
  title: "Masuk ke Akun Anda | STORE.ID",
  description: "Masuk ke akun STORE.ID untuk melacak pesanan dan menikmati kemudahan belanja produk eksklusif.",
};

export const instant = false;

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirectTo?: string; error?: string }>;
}) {
  const resolvedParams = await searchParams;

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-8 overflow-hidden">
      {/* Background ambient decorative glows */}
      <div className="absolute -top-40 -left-40 size-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 size-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-black text-2xl tracking-tight transition hover:opacity-90 mb-3"
          >
            <div className="size-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-extrabold text-base shadow-sm">
              S
            </div>
            <span>
              STORE<span className="text-primary font-bold">.ID</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Selamat Datang Kembali
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5">
            Masuk ke akun Anda untuk melanjutkan belanja
          </p>
        </div>

        <Suspense fallback={<div className="h-80 rounded-xl bg-muted/40 animate-pulse" />}>
          <LoginForm
            redirectTo={resolvedParams.redirectTo}
            initialError={resolvedParams.error}
          />
        </Suspense>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Dengan masuk, Anda menyetujui Ketentuan Layanan & Kebijakan Privasi STORE.ID.
        </p>
      </div>
    </div>
  );
}
