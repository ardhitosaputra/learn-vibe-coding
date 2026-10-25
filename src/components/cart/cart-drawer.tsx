"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  PackageX,
} from "lucide-react";
import { useCartStore } from "@/store/use-cart-store";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button, buttonVariants } from "@/components/ui/button";
import { formatRupiah, cn } from "@/lib/utils";

export function CartDrawer() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    getSubtotal,
    getTotalItems,
  } = useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const totalItems = getTotalItems();
  const subtotal = getSubtotal();

  const handleCheckoutClick = () => {
    closeCart();
    router.push("/checkout");
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent
        side="right"
        className="flex w-full flex-col justify-between sm:max-w-md p-0"
      >
        {/* Drawer Header */}
        <div className="p-6 border-b">
          <SheetHeader className="text-left">
            <SheetTitle className="flex items-center justify-between text-base sm:text-lg font-bold">
              <span className="flex items-center gap-2">
                <ShoppingBag className="size-5 text-primary" />
                Keranjang Belanja
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
                {totalItems} Item
              </span>
            </SheetTitle>
          </SheetHeader>
        </div>

        {/* Drawer Body: Item List or Empty State */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            /* Empty State */
            <div className="flex size-full flex-col items-center justify-center text-center py-12">
              <div className="flex size-16 items-center justify-center rounded-2xl bg-muted/60 text-muted-foreground mb-4">
                <PackageX className="size-8" />
              </div>
              <h3 className="font-bold text-base text-foreground">
                Keranjang Masih Kosong
              </h3>
              <p className="text-xs text-muted-foreground max-w-xs mt-1.5 leading-relaxed">
                Anda belum menambahkan produk apapun. Jelajahi katalog produk kami dan temukan pilihan terbaik Anda.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-6 rounded-xl text-xs font-semibold gap-1.5"
                onClick={() => {
                  closeCart();
                  router.push("/products");
                }}
              >
                Jelajahi Produk <ArrowRight className="size-3.5" />
              </Button>
            </div>
          ) : (
            /* Item List */
            <div className="divide-y divide-border/60">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                  {/* Thumbnail Image */}
                  <div className="relative size-20 shrink-0 overflow-hidden rounded-xl border bg-muted/30">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      sizes="80px"
                      className="object-cover object-center"
                    />
                  </div>

                  {/* Details & Controls */}
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/products/${item.slug}`}
                          onClick={closeCart}
                          className="font-semibold text-xs sm:text-sm line-clamp-1 text-foreground hover:text-primary transition-colors"
                        >
                          {item.name}
                        </Link>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors shrink-0 p-0.5"
                          title="Hapus produk"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>

                      {item.category && (
                        <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                          {item.category}
                        </span>
                      )}

                      <div className="text-xs sm:text-sm font-bold text-foreground mt-1">
                        {formatRupiah(item.price)}
                      </div>
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center rounded-lg border bg-background p-0.5 shadow-2xs">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-6 rounded-md"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="size-3" />
                        </Button>
                        <span className="w-8 text-center text-xs font-bold">
                          {item.quantity}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-6 rounded-md"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.maxStock}
                        >
                          <Plus className="size-3" />
                        </Button>
                      </div>

                      <div className="text-xs font-semibold text-foreground">
                        {formatRupiah(item.price * item.quantity)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer: Subtotal & Checkout Button */}
        {items.length > 0 && (
          <div className="p-6 border-t bg-muted/20 space-y-4">
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Total Item</span>
                <span>{totalItems} barang</span>
              </div>
              <div className="flex items-center justify-between text-sm sm:text-base font-bold text-foreground pt-1">
                <span>Subtotal</span>
                <span className="text-primary font-black tracking-tight">
                  {formatRupiah(subtotal)}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                *Ongkos kirim & diskon voucher dihitung pada halaman checkout.
              </p>
            </div>

            <Button
              className="w-full h-11 text-xs sm:text-sm font-bold rounded-xl shadow-md gap-2"
              onClick={handleCheckoutClick}
            >
              Lanjut ke Checkout <ArrowRight className="size-4" />
            </Button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
              <ShieldCheck className="size-3.5 text-emerald-600" />
              <span>Transaksi Aman & Terverifikasi</span>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
