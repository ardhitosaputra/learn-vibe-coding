import Link from "next/link";
import { ShieldCheck, Truck, RefreshCw, CreditCard, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      {/* Guarantees / Value Proposition Bar */}
      <div className="border-b bg-background">
        <div className="container mx-auto px-4 py-8 sm:px-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-3.5">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Truck className="size-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold">Bebas Ongkir Cepat</h4>
                <p className="text-xs text-muted-foreground">Pengiriman instan & reguler ke seluruh kota</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <ShieldCheck className="size-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold">100% Produk Original</h4>
                <p className="text-xs text-muted-foreground">Jaminan mutu & kurasi langsung dari merchant</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <CreditCard className="size-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold">Pembayaran Fleksibel</h4>
                <p className="text-xs text-muted-foreground">QRIS, VA Bank, & e-Wallet via Midtrans</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <RefreshCw className="size-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold">Garansi Retur 7 Hari</h4>
                <p className="text-xs text-muted-foreground">Klaim mudah jika barang tidak sesuai</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="container mx-auto px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-extrabold text-sm">
                S
              </div>
              <span className="font-black text-xl tracking-tight">STORE<span className="text-primary font-bold">.ID</span></span>
            </div>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              Platform marketplace eksklusif untuk produk pilihan berkualitas tinggi. Dibangun dengan Next.js modern, Supabase, dan sistem pembayaran terintegrasi.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <Badge variant="outline" className="text-xs font-mono font-medium">
                Phase 1: Foundation
              </Badge>
              <Badge variant="secondary" className="text-xs">
                Midtrans Ready
              </Badge>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">Katalog</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="#featured" className="hover:text-foreground transition">
                  Produk Unggulan
                </Link>
              </li>
              <li>
                <Link href="#categories" className="hover:text-foreground transition">
                  Koleksi Terbaru
                </Link>
              </li>
              <li>
                <Link href="#promo" className="hover:text-foreground transition">
                  Promo Spesial
                </Link>
              </li>
              <li>
                <Link href="#best-seller" className="hover:text-foreground transition">
                  Paling Laris
                </Link>
              </li>
            </ul>
          </div>

          {/* Help & Support */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">Bantuan</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="#faq" className="hover:text-foreground transition">
                  FAQ & Pertanyaan
                </Link>
              </li>
              <li>
                <Link href="#shipping" className="hover:text-foreground transition">
                  Informasi Pengiriman
                </Link>
              </li>
              <li>
                <Link href="#terms" className="hover:text-foreground transition">
                  Syarat & Ketentuan
                </Link>
              </li>
              <li>
                <Link href="#privacy" className="hover:text-foreground transition">
                  Kebijakan Privasi
                </Link>
              </li>
            </ul>
          </div>

          {/* Payment Methods Info */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">Metode Bayar</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Dukungan pembayaran digital instan melalui gateway resmi:
            </p>
            <div className="flex flex-wrap gap-1.5">
              <span className="rounded border bg-background px-2 py-1 text-[11px] font-bold text-foreground">QRIS</span>
              <span className="rounded border bg-background px-2 py-1 text-[11px] font-bold text-foreground">BCA VA</span>
              <span className="rounded border bg-background px-2 py-1 text-[11px] font-bold text-foreground">Mandiri</span>
              <span className="rounded border bg-background px-2 py-1 text-[11px] font-bold text-foreground">BNI</span>
              <span className="rounded border bg-background px-2 py-1 text-[11px] font-bold text-foreground">GoPay</span>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© 2026 STORE.ID Marketplace. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Dibuat untuk portofolio & etalase produk berkualitas <Heart className="size-3 text-red-500 fill-red-500" />
          </p>
        </div>
      </div>
    </footer>
  );
}
