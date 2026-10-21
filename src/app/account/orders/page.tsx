import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/actions/auth";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, ShoppingBag, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Pesanan Saya | STORE.ID",
  description: "Daftar riwayat transaksi dan status pengiriman pesanan Anda.",
};

export const instant = false;

export default async function CustomerOrdersPage() {
  const authData = await getCurrentUser();

  if (!authData) {
    redirect("/login?redirectTo=/account/orders");
  }

  const { user, profile } = authData;
  const displayName = profile?.fullName || user.email;

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 max-w-4xl">
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
            Halo <span className="font-medium text-foreground">{displayName}</span>, lacak status pembayaran dan riwayat pengiriman Anda di sini.
          </p>
        </div>
        <Link
          href="/"
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          <ShoppingBag className="size-4 mr-2" /> Belanja Produk Baru
        </Link>
      </div>

      {/* Orders List / Empty State */}
      <div className="mt-8">
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
              href="/#featured"
              className={buttonVariants({ className: "shadow-md" })}
            >
              Jelajahi Katalog <ArrowRight className="size-4 ml-1.5" />
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
