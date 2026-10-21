import { Suspense } from "react";
import Link from "next/link";
import { RegisterForm } from "./register-form";

export const metadata = {
  title: "Daftar Akun Baru | STORE.ID",
  description: "Buat akun STORE.ID untuk kemudahan transaksi, pelacakan pengiriman, dan promo eksklusif.",
};

export const instant = false;

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ redirectTo?: string }>;
}) {
  const resolvedParams = await searchParams;

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-8 overflow-hidden">
      {/* Background ambient decorative glows */}
      <div className="absolute -top-40 -right-40 size-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 size-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

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
            Buat Akun Baru
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5">
            Daftar untuk belanja cepat & lacak pesanan Anda secara real-time
          </p>
        </div>

        <Suspense fallback={<div className="h-96 rounded-xl bg-muted/40 animate-pulse" />}>
          <RegisterForm redirectTo={resolvedParams.redirectTo} />
        </Suspense>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Dengan mendaftar, Anda menyetujui Ketentuan Layanan & Kebijakan Privasi STORE.ID.
        </p>
      </div>
    </div>
  );
}
