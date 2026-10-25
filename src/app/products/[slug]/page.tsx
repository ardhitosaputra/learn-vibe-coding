import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { ChevronRight, ArrowLeft, Star, Share2 } from "lucide-react";
import { getProductBySlug, getRelatedProducts } from "@/db/queries/products";
import { ProductGallery } from "./product-gallery";
import { ProductPurchaseBox } from "./product-purchase-box";
import { ProductCard } from "@/components/products/product-card";
import { formatRupiah } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const instant = false;

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Produk Tidak Ditemukan | STORE.ID",
    };
  }

  const primaryImage =
    product.images.find((img) => img.isPrimary)?.imageUrl ||
    product.images[0]?.imageUrl ||
    "";

  return {
    title: `${product.name} | STORE.ID`,
    description: product.description || "Dapatkan produk eksklusif berkualitas di STORE.ID",
    openGraph: {
      title: `${product.name} | STORE.ID`,
      description: product.description || undefined,
      images: primaryImage ? [{ url: primaryImage }] : [],
      type: "website",
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product.categoryId, product.id, 4);

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 md:py-12">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground mb-8 overflow-x-auto whitespace-nowrap pb-2">
        <Link href="/" className="hover:text-foreground transition-colors">
          Beranda
        </Link>
        <ChevronRight className="size-3.5 shrink-0" />
        <Link href="/products" className="hover:text-foreground transition-colors">
          Katalog
        </Link>
        {product.category && (
          <>
            <ChevronRight className="size-3.5 shrink-0" />
            <Link
              href={`/products?category=${product.category.slug}`}
              className="hover:text-foreground transition-colors"
            >
              {product.category.name}
            </Link>
          </>
        )}
        <ChevronRight className="size-3.5 shrink-0" />
        <span className="font-semibold text-foreground truncate max-w-[200px] sm:max-w-md">
          {product.name}
        </span>
      </nav>

      {/* Main Product Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-16">
        {/* Left Column: Photo Gallery (5 cols on lg) */}
        <div className="lg:col-span-6">
          <ProductGallery
            images={product.images}
            productName={product.name}
            badge={product.badge}
            discountPercent={discountPercent}
          />
        </div>

        {/* Right Column: Product Info & Purchase Controls (7 cols on lg) */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            {/* Category */}
            {product.category && (
              <Link
                href={`/products?category=${product.category.slug}`}
                className="inline-block text-xs font-bold tracking-wider uppercase text-primary hover:underline mb-2"
              >
                {product.category.name}
              </Link>
            )}

            {/* Product Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-foreground leading-tight">
              {product.name}
            </h1>

            {/* Review stars placeholder */}
            <div className="flex items-center gap-2 mt-3">
              <div className="flex items-center text-amber-400">
                <Star className="size-4 fill-amber-400" />
                <Star className="size-4 fill-amber-400" />
                <Star className="size-4 fill-amber-400" />
                <Star className="size-4 fill-amber-400" />
                <Star className="size-4 fill-amber-400" />
              </div>
              <span className="text-xs font-bold text-foreground">5.0</span>
              <span className="text-xs text-muted-foreground">• Ulasan Terverifikasi Pelanggan</span>
            </div>
          </div>

          {/* Pricing Row */}
          <div className="flex items-baseline gap-3 p-4 rounded-2xl bg-muted/30 border">
            <span className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
              {formatRupiah(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-base text-muted-foreground line-through">
                {formatRupiah(product.originalPrice)}
              </span>
            )}
            {discountPercent && (
              <Badge className="bg-rose-600 text-white font-bold text-xs ml-auto">
                Hemat {discountPercent}%
              </Badge>
            )}
          </div>

          {/* Purchase Box (Quantity & Add to Cart) */}
          <ProductPurchaseBox
            product={{
              id: product.id,
              name: product.name,
              price: product.price,
              stock: product.stock,
            }}
          />

          {/* Description Section */}
          <div className="space-y-3 pt-4 border-t">
            <h2 className="text-base font-bold text-foreground">Deskripsi Produk</h2>
            <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
              {product.description || "Tidak ada deskripsi detail untuk produk ini."}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="pt-12 border-t">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-xs font-semibold tracking-wider uppercase text-primary">
                Koleksi Serupa
              </span>
              <h2 className="text-2xl font-bold tracking-tight mt-1">
                Produk Terkait di Kategori {product.category?.name}
              </h2>
            </div>
            {product.category && (
              <Link
                href={`/products?category=${product.category.slug}`}
                className="text-xs sm:text-sm font-semibold text-primary hover:underline"
              >
                Lihat Semua
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
