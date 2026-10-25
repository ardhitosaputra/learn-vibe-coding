import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Sparkles,
  Flame,
  ShieldCheck,
  Truck,
  RotateCcw,
  Zap,
  ShoppingBag,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ProductCard } from "@/components/products/product-card";
import { getFeaturedProducts, getCategories } from "@/db/queries/products";

export const instant = false;

export default async function HomePage() {
  const [featuredProducts, categoriesList] = await Promise.all([
    getFeaturedProducts(8),
    getCategories(),
  ]);

  return (
    <div className="flex flex-col gap-14 sm:gap-20 pb-20">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden border-b bg-gradient-to-b from-muted/50 via-background to-background py-16 sm:py-24">
        {/* Glow ambient background effects */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-24 right-10 size-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container relative mx-auto px-4 sm:px-6">
          <div className="mx-auto max-w-3xl text-center space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border bg-background/80 px-4 py-1.5 text-xs font-semibold backdrop-blur shadow-xs">
              <Sparkles className="size-3.5 text-amber-500" />
              <span>Official Curated Store & Verified Marketplace</span>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] text-primary font-bold">
                Live Catalog
              </span>
            </div>

            <h1 className="text-4xl font-black tracking-tight sm:text-5xl md:text-6xl text-balance">
              Koleksi Produk Eksklusif untuk Gaya Hidup Modern Anda.
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed text-pretty">
              Belanja langsung produk orisinal pilihan dengan jaminan kualitas tertinggi, pengiriman cepat ke seluruh Indonesia, dan simulasi pembayaran digital instan via QRIS & Virtual Account.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/products"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-12 px-7 shadow-md rounded-xl inline-flex items-center gap-2 font-semibold text-sm"
                )}
              >
                Jelajahi Semua Produk <ArrowRight className="size-4" />
              </Link>
              <Link
                href="#categories"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "h-12 px-6 rounded-xl font-medium text-sm"
                )}
              >
                Lihat Kategori
              </Link>
            </div>

            {/* Micro Trust Stats */}
            <div className="grid grid-cols-3 gap-4 pt-10 max-w-lg mx-auto border-t border-border/80">
              <div className="text-center">
                <p className="text-2xl font-black tracking-tight text-foreground">100%</p>
                <p className="text-xs text-muted-foreground font-medium mt-0.5">Original Guaranteed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-black tracking-tight text-foreground">4.9 / 5.0</p>
                <p className="text-xs text-muted-foreground font-medium mt-0.5">Customer Rating</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-black tracking-tight text-foreground">&lt; 24 Jam</p>
                <p className="text-xs text-muted-foreground font-medium mt-0.5">Fast Dispatch</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Value Proposition Grid */}
      <section className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 rounded-2xl border bg-muted/20 p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="size-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Truck className="size-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm sm:text-base">Gratis Ongkir Seluruh Indonesia</h4>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Nikmati gratis ongkos kirim tanpa syarat untuk pesanan pertama dengan kode <strong>STOREFIRST</strong>.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="size-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm sm:text-base">100% Jaminan Orisinal</h4>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Seluruh produk melewati kurasi standar tinggi dengan garansi uang kembali jika tidak sesuai.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="size-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <RotateCcw className="size-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm sm:text-base">Garansi Tukar 7 Hari</h4>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Tukar produk dengan mudah dan tanpa ribet apabila ukuran atau warna tidak pas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Category Showcase Grid */}
      <section id="categories" className="container mx-auto px-4 sm:px-6 scroll-mt-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-semibold tracking-wider uppercase text-primary">
              Koleksi Kurasi
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mt-1">
              Kategori Pilihan
            </h2>
          </div>
          <Link
            href="/products"
            className="text-xs sm:text-sm font-semibold text-primary inline-flex items-center gap-1 hover:underline"
          >
            Semua Produk <ArrowRight className="size-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
          {categoriesList.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="group relative overflow-hidden rounded-2xl border bg-card transition-all duration-300 hover:shadow-lg hover:border-primary/50"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                {cat.imageUrl ? (
                  <Image
                    src={cat.imageUrl}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="size-full flex items-center justify-center bg-muted/60">
                    <ShoppingBag className="size-8 text-muted-foreground" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="font-bold text-sm sm:text-base tracking-tight leading-tight group-hover:text-amber-300 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-white/80 mt-0.5">
                    {cat.productCount} Produk
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Featured Products Section */}
      <section id="featured" className="container mx-auto px-4 sm:px-6 scroll-mt-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-primary font-semibold text-xs tracking-wider uppercase mb-1">
              <Flame className="size-4 text-amber-500 fill-amber-500" />
              <span>Pilihan Terbaik</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Produk Unggulan
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Produk terlaris dengan ulasan tertinggi dan stok siap kirim hari ini.
            </p>
          </div>

          <Link
            href="/products"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "rounded-full text-xs font-semibold gap-1.5")}
          >
            Lihat Katalog Penuh <ArrowRight className="size-3.5" />
          </Link>
        </div>

        {/* Dynamic Products Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 5. Promotional CTA Banner */}
      <section className="container mx-auto px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-primary text-primary-foreground p-8 sm:p-12 shadow-xl">
          <div className="relative z-10 max-w-xl space-y-4">
            <Badge className="bg-primary-foreground/20 text-primary-foreground border-transparent text-xs font-semibold backdrop-blur">
              <Zap className="size-3.5 mr-1 text-amber-300" /> Penawaran Terbatas
            </Badge>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight">
              Klaim Voucher Diskon 20% untuk Pesanan Pertama Anda
            </h3>
            <p className="text-sm sm:text-base opacity-90 leading-relaxed text-pretty">
              Gunakan kode voucher <strong>STOREFIRST</strong> pada halaman checkout untuk langsung memotong total belanjaan Anda.
            </p>
            <div className="pt-2">
              <Link
                href="/products"
                className={cn(
                  buttonVariants({ variant: "secondary", size: "lg" }),
                  "font-bold text-sm h-11 px-6 rounded-xl"
                )}
              >
                Mulai Belanja Sekarang
              </Link>
            </div>
          </div>

          {/* Decorative background circle */}
          <div className="absolute -right-10 -bottom-10 size-80 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        </div>
      </section>
    </div>
  );
}
