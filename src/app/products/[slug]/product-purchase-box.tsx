"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Minus, ShoppingBag, Zap, CheckCircle2, ShieldCheck, Truck, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatRupiah } from "@/lib/utils";
import { toast } from "sonner";
import { useCartStore } from "@/store/use-cart-store";

interface ProductPurchaseBoxProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    originalPrice?: number | null;
    stock: number;
    imageUrl?: string;
    category?: string;
  };
}

export function ProductPurchaseBox({ product }: ProductPurchaseBoxProps) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);

  const isOutOfStock = product.stock <= 0;
  const maxStock = Math.max(0, product.stock);

  const handleIncrement = () => {
    if (quantity < maxStock) {
      setQuantity((prev) => prev + 1);
    } else {
      toast.info(`Maksimal pesanan ${maxStock} item sesuai ketersediaan stok.`);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (isOutOfStock) {
      toast.error("Maaf, produk ini sedang habis.");
      return;
    }

    addItem(
      {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        originalPrice: product.originalPrice,
        imageUrl: product.imageUrl || "",
        maxStock: product.stock,
        category: product.category,
      },
      quantity
    );

    toast.success(`${quantity}x ${product.name} dimasukkan ke keranjang!`, {
      description: `Subtotal: ${formatRupiah(product.price * quantity)}`,
    });
  };

  const handleBuyNow = () => {
    if (isOutOfStock) {
      toast.error("Maaf, produk ini sedang habis.");
      return;
    }

    addItem(
      {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        originalPrice: product.originalPrice,
        imageUrl: product.imageUrl || "",
        maxStock: product.stock,
        category: product.category,
      },
      quantity
    );

    router.push("/checkout");
  };

  return (
    <div className="space-y-6 rounded-3xl border bg-card/60 p-6 backdrop-blur shadow-xs">
      {/* Stock status indicator */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Status Ketersediaan
        </span>
        {isOutOfStock ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-destructive">
            <AlertCircle className="size-4" /> Stok Habis
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="size-4" /> Siap Dikirim ({product.stock} unit tersedia)
          </span>
        )}
      </div>

      {/* Quantity Selector */}
      {!isOutOfStock && (
        <div className="space-y-2">
          <label className="text-xs font-semibold text-foreground">
            Atur Jumlah Pembelian
          </label>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center rounded-2xl border bg-background p-1 shadow-xs">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-8 rounded-xl"
                onClick={handleDecrement}
                disabled={quantity <= 1}
              >
                <Minus className="size-3.5" />
              </Button>
              <span className="w-12 text-center text-sm font-bold">{quantity}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-8 rounded-xl"
                onClick={handleIncrement}
                disabled={quantity >= maxStock}
              >
                <Plus className="size-3.5" />
              </Button>
            </div>

            <div className="text-right">
              <span className="text-xs text-muted-foreground block">Subtotal</span>
              <span className="text-lg font-black text-foreground">
                {formatRupiah(product.price * quantity)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button
          size="lg"
          variant="outline"
          className="flex-1 h-12 rounded-2xl font-bold text-xs sm:text-sm gap-2"
          disabled={isOutOfStock}
          onClick={handleAddToCart}
        >
          <ShoppingBag className="size-4 text-primary" /> Tambah ke Keranjang
        </Button>
        <Button
          size="lg"
          className="flex-1 h-12 rounded-2xl font-bold text-xs sm:text-sm gap-2 shadow-md"
          disabled={isOutOfStock}
          onClick={handleBuyNow}
        >
          <Zap className="size-4 text-amber-300" /> Beli Sekarang
        </Button>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-2 gap-3 pt-4 border-t text-[11px] text-muted-foreground">
        <div className="flex items-center gap-2">
          <Truck className="size-4 text-primary shrink-0" />
          <span>Pengiriman Cepat 24 Jam</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-4 text-primary shrink-0" />
          <span>100% Produk Original</span>
        </div>
      </div>
    </div>
  );
}
