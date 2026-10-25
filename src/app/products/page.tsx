import { Suspense } from "react";
import Link from "next/link";
import { Metadata } from "next";
import { ChevronRight, PackageSearch, ArrowLeft, ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/products/product-card";
import { CatalogFilters, DesktopFilterSidebar } from "./catalog-filters";
import { getCatalogProducts, getCategories } from "@/db/queries/products";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Katalog Produk Pilihan | STORE.ID",
  description:
    "Jelajahi koleksi busana, aksesoris, elektronik, dan dekorasi gaya hidup pilihan berkualitas terbaik.",
};

export const instant = false;

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    q?: string;
    sort?: "newest" | "price-asc" | "price-desc" | "name-asc";
    minPrice?: string;
    maxPrice?: string;
    page?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedParams = await searchParams;

  const category = resolvedParams.category;
  const q = resolvedParams.q;
  const sort = resolvedParams.sort || "newest";
  const minPrice = resolvedParams.minPrice ? Number(resolvedParams.minPrice) : undefined;
  const maxPrice = resolvedParams.maxPrice ? Number(resolvedParams.maxPrice) : undefined;
  const page = resolvedParams.page ? Math.max(1, Number(resolvedParams.page)) : 1;

  const [catalogData, categoriesList] = await Promise.all([
    getCatalogProducts({
      category,
      q,
      sort,
      minPrice,
      maxPrice,
      page,
      limit: 12,
    }),
    getCategories(),
  ]);

  const { items, pagination } = catalogData;

  // Selected category info for title
  const activeCategory = categoriesList.find((c) => c.slug === category);

  // Helper to build page URL
  const buildPageUrl = (targetPage: number) => {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (q) params.set("q", q);
    if (sort && sort !== "newest") params.set("sort", sort);
    if (resolvedParams.minPrice) params.set("minPrice", resolvedParams.minPrice);
    if (resolvedParams.maxPrice) params.set("maxPrice", resolvedParams.maxPrice);
    params.set("page", targetPage.toString());
    return `/products?${params.toString()}`;
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 md:py-12">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground transition-colors">
          Beranda
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="font-semibold text-foreground">Katalog Produk</span>
        {activeCategory && (
          <>
            <ChevronRight className="size-3.5" />
            <span className="text-primary font-semibold">{activeCategory.name}</span>
          </>
        )}
      </nav>

      {/* Catalog Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight">
          {activeCategory ? activeCategory.name : "Koleksi Semua Produk"}
        </h1>
        <p className="text-sm text-muted-foreground mt-1.5 max-w-2xl leading-relaxed">
          {activeCategory?.description ||
            "Temukan berbagai produk berkualitas dari lini fesyen, perlengkapan esensial, gadget inovatif, dan pernak-pernik hunian modern."}
        </p>
      </div>

      {/* Interactive Controls Bar (Search & Mobile Filters) */}
      <div className="mb-6">
        <Suspense fallback={<div className="h-10 bg-muted/30 rounded-xl animate-pulse" />}>
          <CatalogFilters
            categories={categoriesList}
            currentCategory={category}
            currentSort={sort}
            currentQuery={q}
            currentMinPrice={resolvedParams.minPrice}
            currentMaxPrice={resolvedParams.maxPrice}
            totalProducts={categoriesList.reduce((acc, c) => acc + c.productCount, 0)}
          />
        </Suspense>
      </div>

      {/* Main Content Layout: Desktop Sidebar + Products Grid */}
      <div className="flex gap-8 items-start">
        {/* Desktop Sticky Sidebar */}
        <div className="hidden lg:block">
          <Suspense fallback={<div className="w-64 h-96 bg-muted/20 rounded-2xl animate-pulse" />}>
            <DesktopFilterSidebar
              categories={categoriesList}
              currentCategory={category}
              currentMinPrice={resolvedParams.minPrice}
              currentMaxPrice={resolvedParams.maxPrice}
              totalProducts={categoriesList.reduce((acc, c) => acc + c.productCount, 0)}
            />
          </Suspense>
        </div>

        {/* Product Grid / Empty State */}
        <div className="flex-1">
          {items.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed p-12 sm:p-16 text-center bg-muted/10">
              <div className="size-16 rounded-2xl bg-muted/60 flex items-center justify-center text-muted-foreground mb-4">
                <PackageSearch className="size-8" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold">Produk Tidak Ditemukan</h2>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mt-1 leading-relaxed">
                Kami tidak menemukan produk yang cocok dengan kriteria pencarian atau filter Anda. Coba kata kunci lain atau reset filter.
              </p>
              <div className="mt-6">
                <Link
                  href="/products"
                  className={cn(buttonVariants({ variant: "outline", size: "sm" }), "rounded-xl text-xs font-semibold")}
                >
                  Reset Semua Filter
                </Link>
              </div>
            </div>
          ) : (
            /* Products Grid */
            <div>
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                <span>
                  Menampilkan <strong>{items.length}</strong> dari <strong>{pagination.total}</strong> produk
                </span>
                <span>Halaman {pagination.page} dari {pagination.totalPages || 1}</span>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {items.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination Controls */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10 pt-6 border-t">
                  {pagination.hasPrev ? (
                    <Link
                      href={buildPageUrl(pagination.page - 1)}
                      className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1 rounded-xl text-xs font-medium")}
                    >
                      <ArrowLeft className="size-3.5" /> Sebelumnya
                    </Link>
                  ) : (
                    <Button variant="outline" size="sm" disabled className="gap-1 rounded-xl text-xs font-medium">
                      <ArrowLeft className="size-3.5" /> Sebelumnya
                    </Button>
                  )}

                  <span className="px-3 py-1.5 text-xs font-semibold text-muted-foreground">
                    Halaman {pagination.page} / {pagination.totalPages}
                  </span>

                  {pagination.hasNext ? (
                    <Link
                      href={buildPageUrl(pagination.page + 1)}
                      className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1 rounded-xl text-xs font-medium")}
                    >
                      Selanjutnya <ArrowRight className="size-3.5" />
                    </Link>
                  ) : (
                    <Button variant="outline" size="sm" disabled className="gap-1 rounded-xl text-xs font-medium">
                      Selanjutnya <ArrowRight className="size-3.5" />
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
