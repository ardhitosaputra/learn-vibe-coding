import { redirect } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { ChevronRight, ShieldCheck } from "lucide-react";
import { getCurrentUser } from "@/actions/auth";
import { CheckoutForm } from "./checkout-form";

export const metadata: Metadata = {
  title: "Checkout & Pembayaran | STORE.ID",
  description: "Lengkapi data pengiriman dan selesaikan pesanan Anda dengan aman.",
};

export const instant = false;

export default async function CheckoutPage() {
  const authData = await getCurrentUser();

  if (!authData) {
    redirect("/login?redirectTo=/checkout");
  }

  const { user, profile } = authData;

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 md:py-12">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground transition-colors">
          Beranda
        </Link>
        <ChevronRight className="size-3.5" />
        <Link href="/products" className="hover:text-foreground transition-colors">
          Katalog
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="font-semibold text-foreground">Checkout Pembayaran</span>
      </nav>

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
          Konfirmasi & Pembayaran Pesanan
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-xl">
          Periksa kembali rincian produk pilihan Anda dan lengkapi alamat tujuan pengiriman pesanan.
        </p>
      </div>

      {/* Main Interactive Checkout Form */}
      <CheckoutForm
        initialUser={{
          id: user.id,
          email: user.email || "",
          fullName: profile?.fullName || (user.email ? user.email.split("@")[0] : "Pelanggan"),
          phone: profile?.phone || "",
          address: profile?.address || "",
        }}
      />
    </div>
  );
}
