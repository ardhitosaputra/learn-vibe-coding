"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ShoppingBag,
  Star,
  CheckCircle2,
  Sparkles,
  Flame,
  Tag,
  Zap,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  badge: string;
  badgeColor?: string;
  description: string;
  accentBg: string;
}

const DUMMY_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "Minimalist Oversized Tee - Onyx Edition",
    category: "Apparel",
    price: 189000,
    originalPrice: 249000,
    rating: 4.9,
    reviewsCount: 142,
    badge: "Best Seller",
    badgeColor: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
    description: "Katun combed 24s ultra-soft dengan potongan modern drop-shoulder nyaman untuk harian.",
    accentBg: "from-zinc-800 to-zinc-950",
  },
  {
    id: "prod-2",
    name: "Urban Carry EDC Sling Bag Waterproof",
    category: "Accessories",
    price: 329000,
    originalPrice: 419000,
    rating: 4.8,
    reviewsCount: 89,
    badge: "New Arrival",
    badgeColor: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    description: "Material Cordura water-resistant dengan kompartemen aman untuk iPad Mini & charger.",
    accentBg: "from-blue-900 to-slate-950",
  },
  {
    id: "prod-3",
    name: "AeroPulse Wireless Earbuds ANC",
    category: "Electronics",
    price: 549000,
    originalPrice: 699000,
    rating: 5.0,
    reviewsCount: 204,
    badge: "Diskon 21%",
    badgeColor: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30",
    description: "Active Noise Cancellation hingga 35dB dengan bass punchy dan baterai tahan 32 jam.",
    accentBg: "from-indigo-950 to-neutral-900",
  },
  {
    id: "prod-4",
    name: "Signature Scented Candle - Cedar & Amber",
    category: "Living",
    price: 145000,
    originalPrice: 175000,
    rating: 4.7,
    reviewsCount: 63,
    badge: "Eksklusif",
    badgeColor: "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30",
    description: "100% natural soy wax dengan aroma kayu cedarwood menenangkan untuk ruang kerja.",
    accentBg: "from-amber-950 to-stone-900",
  },
];

const CATEGORIES = [
  "Semua Kategori",
  "Apparel",
  "Accessories",
  "Electronics",
  "Living",
];

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState("Semua Kategori");

  const filteredProducts =
    selectedCategory === "Semua Kategori"
      ? DUMMY_PRODUCTS
      : DUMMY_PRODUCTS.filter((p) => p.category === selectedCategory);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleAddToCart = (productName: string) => {
    toast.success(`${productName} ditambahkan ke keranjang!`, {
      description: "Item tersimpan di keranjang belanja Anda.",
    });
  };

  return (
    <div className="flex flex-col gap-12 pb-16">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden border-b bg-gradient-to-b from-muted/40 via-background to-background py-16 md:py-24">
        {/* Subtle decorative glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        <div className="container relative mx-auto px-4 sm:px-6">
          <div className="mx-auto max-w-3xl text-center space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border bg-background/80 px-4 py-1.5 text-xs font-semibold backdrop-blur shadow-xs">
              <Sparkles className="size-3.5 text-amber-500" />
              <span>Official Brand Store & Verified Marketplace</span>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] text-primary">v1.0 Ready</span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-balance">
              Koleksi Produk Eksklusif untuk Gaya Hidup Modern Anda.
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed text-pretty">
              Belanja langsung produk orisinal pilihan dengan jaminan kualitas tertinggi, bebas ongkir, serta alur pembayaran digital instan via QRIS dan Virtual Account.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="#featured"
                className={cn(buttonVariants({ size: "lg" }), "h-11 px-6 shadow-sm inline-flex items-center gap-1.5")}
              >
                Jelajahi Koleksi <ArrowRight className="size-4" />
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="h-11 px-6"
                onClick={() => toast.info("Kode Voucher: STOREFIRST telah disalin ke clipboard!")}
              >
                <Tag className="size-4 mr-1.5 text-primary" /> Klaim Diskon 20%
              </Button>
            </div>

            {/* Micro Stats */}
            <div className="grid grid-cols-3 gap-4 pt-8 max-w-md mx-auto border-t border-muted">
              <div>
                <p className="text-xl sm:text-2xl font-bold tracking-tight">100%</p>
                <p className="text-xs text-muted-foreground">Original Guarantee</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold tracking-tight">4.9 / 5.0</p>
                <p className="text-xs text-muted-foreground">Ulasan Pelanggan</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold tracking-tight">&lt; 24 Jam</p>
                <p className="text-xs text-muted-foreground">Proses Pengiriman</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Featured Catalog Section */}
      <section id="featured" className="container mx-auto px-4 sm:px-6 scroll-mt-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-primary font-semibold text-xs tracking-wider uppercase mb-1">
              <Flame className="size-4 text-amber-500 fill-amber-500" />
              <span>Pilihan Terbaik Musim Ini</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Produk Unggulan
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Paling banyak diminati dan siap dikirim langsung hari ini.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                size="sm"
                className="rounded-full text-xs h-8"
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className="group overflow-hidden flex flex-col justify-between transition-all duration-200 hover:shadow-lg hover:border-primary/40"
            >
              <div>
                {/* Visual Image Placeholder Container */}
                <div
                  className={`relative aspect-square w-full bg-gradient-to-br ${product.accentBg} p-6 flex flex-col justify-between text-white overflow-hidden`}
                >
                  <div className="flex items-center justify-between z-10">
                    <Badge
                      variant="outline"
                      className={`text-[11px] font-semibold backdrop-blur bg-background/80 ${product.badgeColor}`}
                    >
                      {product.badge}
                    </Badge>
                    <span className="text-[11px] font-mono opacity-60">ID: {product.id}</span>
                  </div>

                  {/* Aesthetic Abstract Visual for Product Preview */}
                  <div className="flex flex-col items-center justify-center my-auto transform transition duration-300 group-hover:scale-105">
                    <div className="size-20 rounded-2xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center shadow-inner">
                      <ShoppingBag className="size-9 text-white/80" />
                    </div>
                  </div>

                  <div className="z-10 flex items-center gap-1.5 text-xs text-white/90">
                    <div className="flex items-center text-amber-400">
                      <Star className="size-3.5 fill-amber-400" />
                    </div>
                    <span className="font-semibold">{product.rating}</span>
                    <span className="text-white/60">({product.reviewsCount})</span>
                  </div>
                </div>

                <CardHeader className="p-4 pb-2">
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {product.category}
                  </div>
                  <CardTitle className="text-base font-bold line-clamp-1 group-hover:text-primary transition-colors">
                    {product.name}
                  </CardTitle>
                  <CardDescription className="text-xs line-clamp-2 mt-1">
                    {product.description}
                  </CardDescription>
                </CardHeader>
              </div>

              <div className="p-4 pt-0">
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-lg font-extrabold text-foreground tracking-tight">
                    {formatRupiah(product.price)}
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="text-xs text-muted-foreground line-through">
                      {formatRupiah(product.originalPrice)}
                    </span>
                  )}
                </div>

                <CardFooter className="p-0">
                  <Button
                    className="w-full h-9 text-xs font-semibold gap-1.5 shadow-xs"
                    onClick={() => handleAddToCart(product.name)}
                  >
                    <ShoppingBag className="size-3.5" />
                    Tambah ke Keranjang
                  </Button>
                </CardFooter>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 3. Promo Banner Section */}
      <section className="container mx-auto px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-2xl bg-primary text-primary-foreground p-8 sm:p-10 shadow-md">
          <div className="relative z-10 max-w-xl space-y-4">
            <Badge className="bg-primary-foreground/20 text-primary-foreground border-transparent hover:bg-primary-foreground/20 text-xs">
              <Zap className="size-3.5 mr-1 text-amber-300" /> Penawaran Eksklusif Terbatas
            </Badge>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Dapatkan Diskon Tambahan 15% untuk Pesanan Pertama
            </h3>
            <p className="text-sm opacity-90 leading-relaxed">
              Daftarkan email Anda sekarang untuk mendapatkan kode voucher diskon rahasia dan update rilisan koleksi edisi terbatas kami.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <Button
                variant="secondary"
                className="font-semibold"
                onClick={() => toast.success("Terima kasih! Voucher telah dikirim ke notifikasi.")}
              >
                Dapatkan Kode Promo
              </Button>
            </div>
          </div>
          {/* Decorative shapes */}
          <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 size-72 rounded-full bg-white/5 blur-2xl pointer-events-none" />
        </div>
      </section>
    </div>
  );
}
