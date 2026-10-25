"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ShoppingBag, Menu, User, Sparkles } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "cn";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { toast } from "sonner";
import { UserNav } from "@/components/layout/user-nav";

export function Navbar() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount] = useState(2); // dummy initial count to showcase badge

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/products");
    }
  };

  const openCartNotice = () => {
    toast.success("Keranjang belanja dibuka (Drawer siap dihubungkan di Phase 5)");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Top Announcement Bar */}
      <div className="bg-primary px-4 py-1.5 text-center text-xs font-medium text-primary-foreground tracking-wide flex items-center justify-center gap-2">
        <Sparkles className="size-3.5 animate-pulse text-amber-300" />
        <span>Gratis Ongkir Seluruh Indonesia untuk Transaksi Pertama! Gunakan kode: <strong>STOREFIRST</strong></span>
      </div>

      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 font-black text-xl tracking-tight transition hover:opacity-90">
          <div className="size-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-extrabold text-sm shadow-sm">
            S
          </div>
          <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">STORE<span className="text-primary font-bold">.ID</span></span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <Link href="/" className="text-foreground transition hover:text-foreground/80">
            Beranda
          </Link>
          <Link href="/products" className="transition hover:text-foreground">
            Katalog
          </Link>
          <Link href="/#categories" className="transition hover:text-foreground">
            Kategori
          </Link>
          <Link href="#about" className="transition hover:text-foreground">
            Tentang Kami
          </Link>
        </nav>

        {/* Search Bar - Desktop */}
        <form onSubmit={handleSearch} className="hidden lg:flex relative max-w-xs flex-1">
          <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Cari produk eksklusif..."
            className="pl-9 pr-4 h-9 bg-muted/50 border-muted focus-visible:bg-background"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Cart Trigger */}
          <Button
            variant="ghost"
            size="icon"
            className="relative size-9"
            onClick={openCartNotice}
            aria-label="Keranjang Belanja"
          >
            <ShoppingBag className="size-5" />
            {cartCount > 0 && (
              <Badge className="absolute -top-1 -right-1 size-5 p-0 flex items-center justify-center text-[10px] font-bold rounded-full bg-primary text-primary-foreground">
                {cartCount}
              </Badge>
            )}
          </Button>

          {/* User Account / Auth */}
          <UserNav />

          {/* Mobile Navigation Menu via Sheet */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger
                render={
                  <Button variant="ghost" size="icon" className="size-9" aria-label="Menu Navigasi">
                    <Menu className="size-5" />
                  </Button>
                }
              />
              <SheetContent side="right" className="w-[300px] sm:w-[350px]">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <div className="size-7 rounded bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs">
                      S
                    </div>
                    <span>STORE.ID Menu</span>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 mt-6">
                  {/* Mobile Search */}
                  <form onSubmit={handleSearch} className="relative">
                    <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Cari produk..."
                      className="pl-9 h-9"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </form>

                  <div className="flex flex-col gap-2 font-medium text-sm">
                    <Link href="/" className="px-3 py-2 rounded-md hover:bg-muted transition">
                      Beranda
                    </Link>
                    <Link href="/products" className="px-3 py-2 rounded-md hover:bg-muted transition">
                      Katalog Produk
                    </Link>
                    <Link href="/#categories" className="px-3 py-2 rounded-md hover:bg-muted transition">
                      Kategori
                    </Link>
                    <Link href="#about" className="px-3 py-2 rounded-md hover:bg-muted transition">
                      Tentang Kami
                    </Link>
                    <Link href="/account/orders" className="px-3 py-2 rounded-md hover:bg-muted transition">
                      Pesanan Saya
                    </Link>
                  </div>

                  <div className="border-t pt-4 flex flex-col gap-2">
                    <Link
                      href="/login"
                      className={cn(buttonVariants(), "w-full justify-center")}
                    >
                      <User className="size-4 mr-2" /> Masuk / Daftar Akun
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
