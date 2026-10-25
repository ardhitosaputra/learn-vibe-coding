import { redirect } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { getCurrentUser } from "@/actions/auth";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, ShoppingBag, ArrowRight, CheckCircle2, Clock, Calendar, Truck } from "lucide-react";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { formatRupiah, cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Pesanan Saya | STORE.ID",
  description: "Daftar riwayat transaksi dan status pengiriman pesanan Anda.",
};

export const instant = false;

interface CustomerOrdersPageProps {
  searchParams: Promise<{
    success?: string;
  }>;
}

export default async function CustomerOrdersPage({
  searchParams,
}: CustomerOrdersPageProps) {
  const authData = await getCurrentUser();

  if (!authData) {
    redirect("/login?redirectTo=/account/orders");
  }

  const { user, profile } = authData;
  const userEmail = user.email || "";
  const displayName = profile?.fullName || userEmail.split("@")[0] || "Pelanggan";
  const resolvedParams = await searchParams;
  const newOrderNumber = resolvedParams.success;

  // Query real orders for this user from database
  const userOrders = await db.query.orders.findMany({
    where: eq(orders.userId, profile?.id || user.id),
    orderBy: [desc(orders.createdAt)],
    with: {
      items: {
        with: {
          product: {
            with: {
              images: true,
            },
          },
        },
      },
    },
  });

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 max-w-4xl">
      {/* Success alert banner if just created */}
      {newOrderNumber && (
        <div className="mb-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4 sm:p-5 flex items-start gap-3">
          <CheckCircle2 className="size-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm">
            <h4 className="font-bold text-emerald-800 dark:text-emerald-300">
              Pesanan #{newOrderNumber} Berhasil Dibuat!
            </h4>
            <p className="text-emerald-700 dark:text-emerald-400 mt-0.5 leading-relaxed">
              Pesanan Anda telah tercatat di sistem kami dengan status <strong>Menunggu Pembayaran</strong>. Di Fase 6, Anda dapat langsung melakukan simulasi pembayaran QRIS / Virtual Account Midtrans.
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Pesanan Saya
            </h1>
            <Badge variant="outline" className="text-xs">
              {profile?.role === "admin" ? "Admin" : "Pelanggan"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Halo <span className="font-medium text-foreground">{displayName}</span>, lacak status pembayaran dan riwayat pesanan Anda di sini.
          </p>
        </div>
        <Link
          href="/products"
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          <ShoppingBag className="size-4 mr-2" /> Belanja Produk Lain
        </Link>
      </div>

      {/* Orders List / Empty State */}
      <div className="mt-8 space-y-4">
        {userOrders.length === 0 ? (
          <Card className="border-dashed border-2 bg-muted/20">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="size-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
                <Package className="size-8" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">Belum Ada Riwayat Pesanan</h2>
              <p className="text-sm text-muted-foreground max-w-md mt-1.5 mb-6">
                Anda belum melakukan pembelian apa pun. Temukan koleksi produk eksklusif kami dan nikmati diskon khusus transaksi pertama.
              </p>
              <Link
                href="/products"
                className={buttonVariants({ className: "shadow-md rounded-xl" })}
              >
                Jelajahi Katalog <ArrowRight className="size-4 ml-1.5" />
              </Link>
            </CardContent>
          </Card>
        ) : (
          userOrders.map((order) => {
            const statusConfig = {
              pending: { label: "Menunggu Pembayaran", color: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30" },
              paid: { label: "Dibayar", color: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30" },
              shipped: { label: "Dikirim", color: "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30" },
              cancelled: { label: "Dibatalkan", color: "bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30" },
            }[order.status] || { label: order.status, color: "bg-muted text-muted-foreground" };

            const formattedDate = new Date(order.createdAt).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div
                key={order.id}
                className="rounded-3xl border bg-card p-5 sm:p-6 shadow-xs space-y-4 transition hover:border-primary/40"
              >
                {/* Order Top Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs sm:text-sm text-foreground">
                      #{order.orderNumber}
                    </span>
                    <Badge variant="outline" className={`text-[11px] font-semibold ${statusConfig.color}`}>
                      {statusConfig.label}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="size-3.5" />
                    <span>{formattedDate}</span>
                  </div>
                </div>

                {/* Items List */}
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-xs sm:text-sm">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-bold text-foreground">
                          {item.quantity}x
                        </span>
                        <span className="text-muted-foreground truncate">
                          {item.product?.name || "Produk Marketplace"}
                        </span>
                      </div>
                      <span className="font-semibold text-foreground shrink-0 ml-2">
                        {formatRupiah(item.subtotal)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Shipping & Total Amount */}
                <div className="pt-3 border-t flex flex-wrap items-center justify-between gap-3">
                  <div className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                    <Truck className="size-3.5 text-primary shrink-0" />
                    <span className="truncate max-w-xs">{order.shippingAddress}</span>
                  </div>

                  <div className="flex items-baseline gap-2 text-right">
                    <span className="text-xs text-muted-foreground">Total Tagihan:</span>
                    <span className="text-base font-black text-primary tracking-tight">
                      {formatRupiah(order.totalAmount)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
