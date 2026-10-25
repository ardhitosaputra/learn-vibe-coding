"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Eye, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatRupiah } from "@/lib/utils";
import { toast } from "sonner";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    originalPrice?: number | null;
    stock: number;
    badge?: string | null;
    category?: {
      name: string;
      slug: string;
    } | null;
    images?: Array<{
      id: string;
      imageUrl: string;
      isPrimary: boolean;
    }>;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const primaryImage =
    product.images?.find((img) => img.isPrimary)?.imageUrl ||
    product.images?.[0]?.imageUrl ||
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80";

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.stock <= 0) {
      toast.error("Maaf, stok produk ini sedang habis!");
      return;
    }

    toast.success(`${product.name} berhasil ditambahkan!`, {
      description: "Item tersimpan di keranjang belanja Anda.",
    });
  };

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary/40">
      <Link href={`/products/${product.slug}`} className="block overflow-hidden">
        {/* Image Container */}
        <div className="relative aspect-square w-full overflow-hidden bg-muted/30">
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover object-center transition-transform duration-500 will-change-transform group-hover:scale-108"
          />

          {/* Badges Overlay */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
            <div className="flex flex-wrap gap-1.5">
              {product.badge && (
                <Badge
                  variant="secondary"
                  className="bg-background/85 backdrop-blur-md text-foreground font-semibold text-[11px] shadow-xs border-background/20"
                >
                  {product.badge}
                </Badge>
              )}
              {discountPercent && (
                <Badge className="bg-rose-600 hover:bg-rose-600 text-white font-bold text-[11px] shadow-xs">
                  -{discountPercent}%
                </Badge>
              )}
            </div>

            {product.stock <= 0 && (
              <Badge variant="destructive" className="text-[11px] font-bold">
                Habis
              </Badge>
            )}
          </div>

          {/* Quick Hover Overlay */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background/90 text-foreground text-xs font-medium backdrop-blur shadow-md">
              <Eye className="size-3.5 text-primary" /> Lihat Detail
            </span>
          </div>
        </div>
      </Link>

      {/* Product Content Details */}
      <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
        <div>
          {/* Category */}
          {product.category && (
            <Link
              href={`/products?category=${product.category.slug}`}
              className="text-[11px] font-semibold tracking-wider uppercase text-muted-foreground hover:text-primary transition-colors block mb-1"
            >
              {product.category.name}
            </Link>
          )}

          {/* Title */}
          <Link href={`/products/${product.slug}`} className="block">
            <h3 className="font-semibold text-sm sm:text-base leading-snug line-clamp-2 text-foreground group-hover:text-primary transition-colors">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Pricing & Add to Cart button */}
        <div className="mt-4 pt-3 border-t border-border/60">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-base sm:text-lg font-bold text-foreground tracking-tight">
              {formatRupiah(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-muted-foreground line-through">
                {formatRupiah(product.originalPrice)}
              </span>
            )}
          </div>

          <Button
            className="w-full h-9 text-xs font-semibold gap-1.5 rounded-xl shadow-xs"
            disabled={product.stock <= 0}
            onClick={handleAddToCart}
          >
            <ShoppingBag className="size-3.5" />
            {product.stock > 0 ? "Tambah ke Keranjang" : "Stok Habis"}
          </Button>
        </div>
      </div>
    </div>
  );
}
