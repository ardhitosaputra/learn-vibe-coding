"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useTransition } from "react";
import { Search, SlidersHorizontal, X, ArrowUpDown, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface CategoryOption {
  id: string;
  name: string;
  slug: string;
  productCount: number;
}

interface CatalogFiltersProps {
  categories: CategoryOption[];
  currentCategory?: string;
  currentSort?: string;
  currentQuery?: string;
  currentMinPrice?: string;
  currentMaxPrice?: string;
  totalProducts: number;
}

const SORT_OPTIONS = [
  { label: "Terbaru", value: "newest" },
  { label: "Harga: Rendah ke Tinggi", value: "price-asc" },
  { label: "Harga: Tinggi ke Rendah", value: "price-desc" },
  { label: "Nama (A-Z)", value: "name-asc" },
];

export function CatalogFilters({
  categories,
  currentCategory = "all",
  currentSort = "newest",
  currentQuery = "",
  currentMinPrice = "",
  currentMaxPrice = "",
  totalProducts,
}: CatalogFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [searchInput, setSearchInput] = useState(currentQuery);
  const [minPriceInput, setMinPriceInput] = useState(currentMinPrice);
  const [maxPriceInput, setMaxPriceInput] = useState(currentMaxPrice);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Helper to update search params
  const applyFilters = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    // Reset to page 1 whenever filters change
    params.delete("page");

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "" || value === "all") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters({ q: searchInput.trim() || null });
  };

  const handlePriceFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters({
      minPrice: minPriceInput.trim() || null,
      maxPrice: maxPriceInput.trim() || null,
    });
    setIsMobileOpen(false);
  };

  const resetAllFilters = () => {
    setSearchInput("");
    setMinPriceInput("");
    setMaxPriceInput("");
    setIsMobileOpen(false);
    startTransition(() => {
      router.push(pathname);
    });
  };

  const hasActiveFilters =
    (currentCategory && currentCategory !== "all") ||
    Boolean(currentQuery) ||
    Boolean(currentMinPrice) ||
    Boolean(currentMaxPrice) ||
    currentSort !== "newest";

  const renderFilterContent = () => (
    <div className="space-y-6">
      {/* Category List */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
          Kategori
        </h3>
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => {
              applyFilters({ category: null });
              setIsMobileOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition ${
              currentCategory === "all" || !currentCategory
                ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
            }`}
          >
            <span>Semua Kategori</span>
            <span className="text-[11px] opacity-80">{totalProducts}</span>
          </button>

          {categories.map((cat) => {
            const isSelected = currentCategory === cat.slug;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  applyFilters({ category: cat.slug });
                  setIsMobileOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition ${
                  isSelected
                    ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                }`}
              >
                <span>{cat.name}</span>
                <span className="text-[11px] opacity-80">{cat.productCount}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range Filter */}
      <form onSubmit={handlePriceFilterSubmit} className="space-y-3 pt-4 border-t">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Rentang Harga (Rp)
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={minPriceInput}
            onChange={(e) => setMinPriceInput(e.target.value)}
            className="h-8 text-xs rounded-lg"
          />
          <Input
            type="number"
            placeholder="Maks"
            value={maxPriceInput}
            onChange={(e) => setMaxPriceInput(e.target.value)}
            className="h-8 text-xs rounded-lg"
          />
        </div>
        <Button type="submit" variant="outline" size="sm" className="w-full h-8 text-xs font-semibold rounded-lg">
          Terapkan Harga
        </Button>
      </form>

      {/* Reset Button */}
      {hasActiveFilters && (
        <div className="pt-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={resetAllFilters}
            className="w-full h-8 text-xs font-medium text-muted-foreground hover:text-foreground justify-center gap-1.5"
          >
            <RotateCcw className="size-3.5" /> Reset Semua Filter
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Search Bar & Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input Form */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Cari produk berdasarkan nama atau deskripsi..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="h-10 pl-9 pr-9 text-xs sm:text-sm rounded-xl bg-background border-border"
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => {
                setSearchInput("");
                applyFilters({ q: null });
              }}
              className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          )}
        </form>

        <div className="flex items-center gap-2">
          {/* Mobile Filter Sheet Trigger */}
          <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="outline"
                  size="sm"
                  className="h-10 px-3 rounded-xl lg:hidden text-xs font-medium gap-1.5 shrink-0"
                >
                  <SlidersHorizontal className="size-3.5" />
                  Filter {hasActiveFilters && "•"}
                </Button>
              }
            />
            <SheetContent side="left" className="w-72 sm:w-80">
              <SheetHeader className="mb-4 text-left">
                <SheetTitle className="text-base font-bold">Filter Katalog</SheetTitle>
              </SheetHeader>
              {renderFilterContent()}
            </SheetContent>
          </Sheet>

          {/* Sorting Dropdown */}
          <div className="relative shrink-0">
            <select
              value={currentSort}
              onChange={(e) => applyFilters({ sort: e.target.value })}
              className="h-10 px-3 pr-8 rounded-xl border border-border bg-background text-xs font-medium text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary appearance-none cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ArrowUpDown className="pointer-events-none absolute right-2.5 top-3 size-3.5 text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* Active Filter Badges */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-xs text-muted-foreground font-medium mr-1">Filter aktif:</span>

          {currentCategory && currentCategory !== "all" && (
            <Badge variant="secondary" className="gap-1 text-xs py-0.5 px-2">
              Kategori: {categories.find((c) => c.slug === currentCategory)?.name || currentCategory}
              <button
                type="button"
                onClick={() => applyFilters({ category: null })}
                className="hover:text-destructive"
              >
                <X className="size-3" />
              </button>
            </Badge>
          )}

          {currentQuery && (
            <Badge variant="secondary" className="gap-1 text-xs py-0.5 px-2">
              Pencarian: &quot;{currentQuery}&quot;
              <button
                type="button"
                onClick={() => {
                  setSearchInput("");
                  applyFilters({ q: null });
                }}
                className="hover:text-destructive"
              >
                <X className="size-3" />
              </button>
            </Badge>
          )}

          {(currentMinPrice || currentMaxPrice) && (
            <Badge variant="secondary" className="gap-1 text-xs py-0.5 px-2">
              Harga: Rp {currentMinPrice || "0"} - Rp {currentMaxPrice || "Maks"}
              <button
                type="button"
                onClick={() => {
                  setMinPriceInput("");
                  setMaxPriceInput("");
                  applyFilters({ minPrice: null, maxPrice: null });
                }}
                className="hover:text-destructive"
              >
                <X className="size-3" />
              </button>
            </Badge>
          )}

          <button
            type="button"
            onClick={resetAllFilters}
            className="text-[11px] font-semibold text-primary hover:underline ml-1"
          >
            Hapus Semua
          </button>
        </div>
      )}

      {/* Desktop Sidebar Exported in Main Page */}
      <div className="hidden">{/* Placeholder */}</div>
    </div>
  );
}

export function DesktopFilterSidebar({
  categories,
  currentCategory = "all",
  currentMinPrice = "",
  currentMaxPrice = "",
  totalProducts,
}: {
  categories: CategoryOption[];
  currentCategory?: string;
  currentMinPrice?: string;
  currentMaxPrice?: string;
  totalProducts: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [minPriceInput, setMinPriceInput] = useState(currentMinPrice);
  const [maxPriceInput, setMaxPriceInput] = useState(currentMaxPrice);

  const applyFilters = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "" || value === "all") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    router.push(`${pathname}?${params.toString()}`);
  };

  const handlePriceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters({
      minPrice: minPriceInput.trim() || null,
      maxPrice: maxPriceInput.trim() || null,
    });
  };

  return (
    <aside className="w-64 shrink-0 rounded-2xl border bg-card p-5 text-card-foreground shadow-xs h-fit sticky top-24 space-y-6">
      {/* Category Navigation */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
          Kategori Produk
        </h3>
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => applyFilters({ category: null })}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition ${
              currentCategory === "all" || !currentCategory
                ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
            }`}
          >
            <span>Semua Kategori</span>
            <span className="text-[11px] opacity-80">{totalProducts}</span>
          </button>

          {categories.map((cat) => {
            const isSelected = currentCategory === cat.slug;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => applyFilters({ category: cat.slug })}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition ${
                  isSelected
                    ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                }`}
              >
                <span>{cat.name}</span>
                <span className="text-[11px] opacity-80">{cat.productCount}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range */}
      <form onSubmit={handlePriceSubmit} className="space-y-3 pt-4 border-t">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Rentang Harga (Rp)
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={minPriceInput}
            onChange={(e) => setMinPriceInput(e.target.value)}
            className="h-8 text-xs rounded-lg"
          />
          <Input
            type="number"
            placeholder="Maks"
            value={maxPriceInput}
            onChange={(e) => setMaxPriceInput(e.target.value)}
            className="h-8 text-xs rounded-lg"
          />
        </div>
        <Button type="submit" variant="outline" size="sm" className="w-full h-8 text-xs font-semibold rounded-lg">
          Terapkan
        </Button>
      </form>
    </aside>
  );
}
