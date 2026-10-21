import Link from "next/link";
import { db } from "@/db";
import { products, categories, orders, profiles } from "@/db/schema";
import { count } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Package, FolderTree, ShoppingBag, Users, ArrowUpRight, ShieldCheck, Database } from "lucide-react";

export const instant = false;

export default async function AdminDashboardPage() {
  // Fetch live stats from PostgreSQL database
  let productCount = 0;
  let categoryCount = 0;
  let orderCount = 0;
  let userCount = 0;

  try {
    const [pRes, cRes, oRes, uRes] = await Promise.all([
      db.select({ value: count() }).from(products),
      db.select({ value: count() }).from(categories),
      db.select({ value: count() }).from(orders),
      db.select({ value: count() }).from(profiles),
    ]);
    productCount = pRes[0]?.value || 0;
    categoryCount = cRes[0]?.value || 0;
    orderCount = oRes[0]?.value || 0;
    userCount = uRes[0]?.value || 0;
  } catch (e) {
    console.error("Failed to load dashboard metrics:", e);
  }

  const statCards = [
    {
      title: "Total Produk",
      value: productCount,
      description: "Produk aktif di katalog",
      icon: Package,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Kategori Produk",
      value: categoryCount,
      description: "Klasifikasi katalog aktif",
      icon: FolderTree,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Pesanan Masuk",
      value: orderCount,
      description: "Transaksi via Midtrans",
      icon: ShoppingBag,
      color: "text-violet-500",
      bg: "bg-violet-500/10",
    },
    {
      title: "Pengguna Terdaftar",
      value: userCount,
      description: "Pelanggan & admin terhubung",
      icon: Users,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Ringkasan Marketplace
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Pantau data katalog, aktivitas pengguna, dan status pesanan secara real-time.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/"
            target="_blank"
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            Lihat Toko Publik <ArrowUpRight className="size-4 ml-1" />
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="shadow-xs">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {stat.title}
                </CardTitle>
                <div className={`size-8 rounded-lg ${stat.bg} ${stat.color} flex items-center justify-center`}>
                  <Icon className="size-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {stat.value}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Access Roadmap Card */}
      <Card className="border-border/60 bg-card/60 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Database className="size-5 text-primary" />
            <CardTitle className="text-base font-semibold">
              Status Integrasi Backend Phase 3
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            ✅ <strong>Supabase Auth & RBAC</strong> aktif: Sesi autentikasi tersinkronisasi dengan middleware Next.js 16 dan tabel profil PostgreSQL.
          </p>
          <p>
            🚀 <strong>Langkah Berikutnya (Phase 4 & 5)</strong>: Integrasi katalog produk dinamis dari database dan slide-over cart drawer dengan Zustand.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
