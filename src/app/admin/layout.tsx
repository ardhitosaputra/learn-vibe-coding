import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/actions/auth";
import { ShieldCheck, Package, ShoppingCart, Users, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Admin Panel | STORE.ID",
  description: "Dashboard manajemen marketplace, katalog produk, dan pesanan.",
};

export const instant = false;

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authData = await getCurrentUser();

  // Strict server-side RBAC validation
  if (!authData || authData.profile?.role !== "admin") {
    redirect("/?error=unauthorized");
  }

  return (
    <div className="min-h-screen bg-muted/20">
      {/* Admin Subheader / Breadcrumb bar */}
      <div className="border-b bg-card px-4 sm:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition"
          >
            <ArrowLeft className="size-3.5" /> Toko Publik
          </Link>
          <span className="text-muted-foreground/40">/</span>
          <div className="flex items-center gap-1.5 font-semibold text-sm text-foreground">
            <ShieldCheck className="size-4 text-amber-500" />
            <span>Admin Control Center</span>
          </div>
          <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 text-[10px] h-5">
            Role: Admin
          </Badge>
        </div>
        <div className="text-xs text-muted-foreground">
          Akun: <span className="font-medium text-foreground">{authData.user.email}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-8 py-8">
        {children}
      </div>
    </div>
  );
}
