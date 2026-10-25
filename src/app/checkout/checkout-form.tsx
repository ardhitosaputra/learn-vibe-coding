"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Truck,
  ShieldCheck,
  Tag,
  CreditCard,
  ShoppingBag,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Clock,
  Zap,
} from "lucide-react";
import { useCartStore } from "@/store/use-cart-store";
import { createDraftOrder } from "@/actions/order";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatRupiah } from "@/lib/utils";
import { toast } from "sonner";

interface CheckoutFormProps {
  initialUser: {
    id: string;
    email: string;
    fullName?: string | null;
    phone?: string | null;
    address?: string | null;
  };
}

const COURIER_OPTIONS = [
  {
    id: "reguler",
    name: "Reguler (SiCepat / JNE)",
    estimate: "2-3 hari kerja",
    cost: 15000,
  },
  {
    id: "express",
    name: "Next Day Express",
    estimate: "1 hari kerja",
    cost: 25000,
  },
  {
    id: "instant",
    name: "Instant / Same Day",
    estimate: "Tiba dalam 3-6 jam",
    cost: 35000,
  },
];

export function CheckoutForm({ initialUser }: CheckoutFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const { items, getSubtotal, clearCart } = useCartStore();

  // Form Fields
  const [fullName, setFullName] = useState(initialUser.fullName || "");
  const [phone, setPhone] = useState(initialUser.phone || "");
  const [address, setAddress] = useState(initialUser.address || "");
  const [city, setCity] = useState("Jakarta Selatan");
  const [postalCode, setPostalCode] = useState("12190");
  const [notes, setNotes] = useState("");

  // Shipping selection
  const [selectedCourier, setSelectedCourier] = useState(COURIER_OPTIONS[0]);

  // Voucher state
  const [voucherInput, setVoucherInput] = useState("STOREFIRST");
  const [appliedVoucher, setAppliedVoucher] = useState<string | null>("STOREFIRST");

  const subtotal = getSubtotal();

  // Discount calculation (20% for STOREFIRST)
  const discountAmount =
    appliedVoucher === "STOREFIRST" ? Math.round(subtotal * 0.2) : 0;

  const totalAmount = Math.max(
    0,
    subtotal + selectedCourier.cost - discountAmount
  );

  const handleApplyVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!voucherInput.trim()) return;

    if (voucherInput.trim().toUpperCase() === "STOREFIRST") {
      setAppliedVoucher("STOREFIRST");
      toast.success("Voucher STOREFIRST aktif!", {
        description: "Diskon 20% berhasil dipotong dari total belanja.",
      });
    } else {
      toast.error("Kode voucher tidak valid atau sudah kedaluwarsa.");
    }
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
    setVoucherInput("");
    toast.info("Voucher diskon dihapus.");
  };

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      toast.error("Keranjang belanja Anda kosong.");
      return;
    }

    if (!fullName.trim() || !phone.trim() || !address.trim() || !city.trim()) {
      toast.error("Mohon lengkapi seluruh kolom alamat pengiriman.");
      return;
    }

    startTransition(async () => {
      const fullShippingText = `${address.trim()}, ${city.trim()} ${postalCode.trim()}${
        notes.trim() ? ` (Catatan: ${notes.trim()})` : ""
      }`;

      const res = await createDraftOrder({
        items: items.map((i) => ({ productId: i.id, quantity: i.quantity })),
        customerName: fullName,
        customerEmail: initialUser.email,
        customerPhone: phone,
        shippingAddress: fullShippingText,
        courier: selectedCourier.name,
        shippingCost: selectedCourier.cost,
        voucherCode: appliedVoucher || undefined,
      });

      if (res.error) {
        toast.error("Gagal membuat pesanan", { description: res.error });
        return;
      }

      if (res.success && res.orderNumber) {
        clearCart();
        toast.success(`Pesanan #${res.orderNumber} Berhasil Dibuat!`, {
          description: "Pesanan tersimpan dengan status 'Menunggu Pembayaran'.",
        });

        // Redirect to orders page with success flag
        router.push(`/account/orders?success=${res.orderNumber}`);
      }
    });
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed p-12 sm:p-16 text-center bg-muted/10 my-8">
        <div className="size-16 rounded-2xl bg-muted/60 flex items-center justify-center text-muted-foreground mb-4">
          <ShoppingBag className="size-8" />
        </div>
        <h2 className="text-xl font-bold">Keranjang Belanja Kosong</h2>
        <p className="text-sm text-muted-foreground max-w-sm mt-1 leading-relaxed">
          Tidak ada item untuk diproses di checkout. Silakan pilih produk pilihan Anda di katalog terlebih dahulu.
        </p>
        <Link
          href="/products"
          className="mt-6 inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs sm:text-sm shadow-md"
        >
          Lihat Katalog Produk <ArrowRight className="size-4" />
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleCreateOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Column: Shipping Form & Courier (7 cols) */}
      <div className="lg:col-span-7 space-y-6">
        {/* Customer & Address Form */}
        <div className="rounded-3xl border bg-card p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-foreground font-bold text-base border-b pb-3">
            <Truck className="size-5 text-primary" />
            <span>Alamat Pengiriman Pesanan</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Nama Penerima <span className="text-destructive">*</span>
              </label>
              <Input
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Contoh: Budi Santoso"
                className="h-10 text-xs sm:text-sm rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Nomor Telepon / WhatsApp <span className="text-destructive">*</span>
              </label>
              <Input
                required
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="08123456789"
                className="h-10 text-xs sm:text-sm rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Alamat Lengkap (Jalan, No. Rumah, RT/RW, Patokan) <span className="text-destructive">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Jl. Sudirman No. 45, RT 02/05, Kebayoran Baru"
              className="w-full rounded-xl border border-input bg-background p-3 text-xs sm:text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Kota / Kabupaten <span className="text-destructive">*</span>
              </label>
              <Input
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Jakarta Selatan"
                className="h-10 text-xs sm:text-sm rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Kode Pos
              </label>
              <Input
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="12190"
                className="h-10 text-xs sm:text-sm rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Catatan untuk Kurir (Opsional)
            </label>
            <Input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Titipkan di pos satpam atau meja depan"
              className="h-10 text-xs sm:text-sm rounded-xl"
            />
          </div>
        </div>

        {/* Shipping Courier Selector */}
        <div className="rounded-3xl border bg-card p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-foreground font-bold text-base border-b pb-3">
            <Clock className="size-5 text-primary" />
            <span>Pilih Layanan Pengiriman</span>
          </div>

          <div className="space-y-2.5">
            {COURIER_OPTIONS.map((c) => {
              const isSelected = selectedCourier.id === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedCourier(c)}
                  className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? "border-primary bg-primary/5 ring-1 ring-primary shadow-xs"
                      : "border-border hover:bg-muted/40"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`size-4 rounded-full border flex items-center justify-center ${
                        isSelected ? "border-primary" : "border-muted-foreground"
                      }`}
                    >
                      {isSelected && (
                        <div className="size-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-xs sm:text-sm text-foreground">
                        {c.name}
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        Estimasi: {c.estimate}
                      </p>
                    </div>
                  </div>

                  <span className="font-extrabold text-xs sm:text-sm text-foreground">
                    {formatRupiah(c.cost)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Column: Order Summary (5 cols) */}
      <div className="lg:col-span-5 space-y-6">
        <div className="rounded-3xl border bg-card p-6 shadow-md sticky top-24 space-y-5">
          <h2 className="font-black text-lg text-foreground tracking-tight border-b pb-3">
            Ringkasan Pesanan
          </h2>

          {/* Items Preview */}
          <div className="max-h-60 overflow-y-auto divide-y divide-border/60 pr-1">
            {items.map((item) => (
              <div key={item.id} className="flex gap-3 py-3 first:pt-0 last:pb-0">
                <div className="relative size-14 shrink-0 rounded-lg overflow-hidden border bg-muted">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground truncate">
                    {item.name}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {item.quantity} x {formatRupiah(item.price)}
                  </p>
                </div>
                <span className="text-xs font-bold text-foreground shrink-0">
                  {formatRupiah(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Voucher Promo Input */}
          <div className="pt-2 border-t">
            {appliedVoucher ? (
              <div className="flex items-center justify-between rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-2">
                <div className="flex items-center gap-2">
                  <Tag className="size-4 text-emerald-600" />
                  <div>
                    <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                      Voucher {appliedVoucher}
                    </p>
                    <p className="text-[10px] text-emerald-600/80">
                      Diskon 20% Berhasil Diterapkan
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveVoucher}
                  className="text-xs font-semibold text-destructive hover:underline"
                >
                  Hapus
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Input
                  placeholder="Kode voucher promo"
                  value={voucherInput}
                  onChange={(e) => setVoucherInput(e.target.value)}
                  className="h-9 text-xs rounded-xl uppercase"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleApplyVoucher}
                  className="h-9 px-3 text-xs font-semibold rounded-xl"
                >
                  Gunakan
                </Button>
              </div>
            )}
          </div>

          {/* Price Breakdown */}
          <div className="space-y-2 pt-3 border-t text-xs">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal Produk</span>
              <span>{formatRupiah(subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Biaya Pengiriman</span>
              <span>{formatRupiah(selectedCourier.cost)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                <span>Potongan Diskon (20%)</span>
                <span>-{formatRupiah(discountAmount)}</span>
              </div>
            )}

            <div className="flex justify-between text-base font-black text-foreground pt-3 border-t">
              <span>Total Pembayaran</span>
              <span className="text-primary text-xl font-black tracking-tight">
                {formatRupiah(totalAmount)}
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isPending}
            className="w-full h-12 rounded-2xl font-bold text-sm shadow-md gap-2"
          >
            {isPending ? (
              <span>Memproses Pesanan...</span>
            ) : (
              <>
                <Zap className="size-4 text-amber-300" />
                <span>Buat Pesanan & Bayar</span>
              </>
            )}
          </Button>

          {/* Phase Notice */}
          <div className="rounded-xl bg-muted/40 p-3 text-[11px] text-muted-foreground space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-foreground">
              <CreditCard className="size-3.5 text-primary" />
              <span>Metode Pembayaran (Fase 6 Sandbox)</span>
            </div>
            <p>
              Klik tombol di atas akan menyimpan draft pesanan di database Supabase dan mempersiapkan integrasi simulasi QRIS / Virtual Account Midtrans Snap di Fase 6.
            </p>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground pt-1">
            <ShieldCheck className="size-3.5 text-emerald-600" />
            <span>Garansi 100% Produk Original & Bebas Penipuan</span>
          </div>
        </div>
      </div>
    </form>
  );
}
