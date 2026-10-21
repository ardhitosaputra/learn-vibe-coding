import Link from "next/link";
import { ForgotPasswordForm } from "./forgot-password-form";

export const metadata = {
  title: "Lupa Kata Sandi | STORE.ID",
  description: "Reset kata sandi akun STORE.ID Anda melalui email.",
};

export default function ForgotPasswordPage() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-8 overflow-hidden">
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
            Lupa Kata Sandi?
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5">
            Masukkan email terdaftar Anda dan kami akan mengirimkan tautan untuk mengatur ulang kata sandi.
          </p>
        </div>

        <ForgotPasswordForm />
      </div>
    </div>
  );
}
