import { config } from "dotenv";
config({ path: ".env.local" });

import { db } from "./index";
import { categories, products, productImages } from "./schema";
import { eq } from "drizzle-orm";

async function main() {
  console.log("🌱 Starting enhanced database seeding...");

  if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes("127.0.0.1")) {
    console.warn(
      "⚠️ DATABASE_URL belum diarahkan ke database cloud Supabase aktif. Lewati eksekusi jaringan."
    );
    return;
  }

  // 1. Seed Categories with Category Images
  console.log("1️⃣ Seeding / Updating categories...");
  const categoryData = [
    {
      name: "Apparel",
      slug: "apparel",
      description: "Pakaian kurasi eksklusif dengan kenyamanan maksimal dan potongan kontemporer.",
      imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Accessories",
      slug: "accessories",
      description: "Aksesoris harian dan perlengkapan EDC modern tangguh dan stylish.",
      imageUrl: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Electronics",
      slug: "electronics",
      description: "Perangkat audio, periferal, dan gadget premium penunjang produktivitas.",
      imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Living",
      slug: "living",
      description: "Dekorasi estetik dan aromaterapi penunjang suasana hangat hunian Anda.",
      imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80",
    },
  ];

  for (const cat of categoryData) {
    await db
      .insert(categories)
      .values(cat)
      .onConflictDoUpdate({
        target: categories.slug,
        set: {
          description: cat.description,
          imageUrl: cat.imageUrl,
        },
      });
  }

  // Fetch all categories mapped by slug
  const allCategories = await db.select().from(categories);
  const catMap = new Map(allCategories.map((c) => [c.slug, c.id]));
  console.log(`✅ ${allCategories.length} categories ready!`);

  // 2. Seed 8 Curated Products
  console.log("2️⃣ Seeding products...");
  const productsToSeed = [
    {
      categorySlug: "apparel",
      name: "Minimalist Oversized Tee - Onyx Edition",
      slug: "minimalist-oversized-tee-onyx",
      description:
        "T-Shirt katun combed 24s ultra-soft dengan potongan modern drop-shoulder. Tekstur halus, adem sepanjang hari, dan tidak mudah melar setelah pencucian berulang. Cocok dipadukan untuk gaya kasual sehari-hari.",
      price: 189000,
      originalPrice: 249000,
      stock: 50,
      badge: "Best Seller",
      isActive: true,
      images: [
        {
          url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80",
          isPrimary: true,
        },
        {
          url: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=80",
          isPrimary: false,
        },
      ],
    },
    {
      categorySlug: "apparel",
      name: "Classic Heavyweight Hoodie - Fog Grey",
      slug: "classic-heavyweight-hoodie-fog-grey",
      description:
        "Hoodie fleece premium bergramasi 380 GSM dengan fit boxy yang kokoh. Dilengkapi kantong kanguru lapang dan tali hoodie berujung metalik matte. Menghadirkan kehangatan optimal tanpa terasa gerah.",
      price: 389000,
      originalPrice: 479000,
      stock: 30,
      badge: "New Arrival",
      isActive: true,
      images: [
        {
          url: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80",
          isPrimary: true,
        },
        {
          url: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1000&q=80",
          isPrimary: false,
        },
      ],
    },
    {
      categorySlug: "accessories",
      name: "Urban Carry EDC Sling Bag Waterproof",
      slug: "urban-carry-edc-sling-bag",
      description:
        "Tas selempang multifungsi dari material Cordura 500D water-resistant dengan resleting YKK AquaGuard. Dilengkapi kompartemen busa empuk yang pas untuk iPad Mini/tablet hingga 8.3 inch, dompet, kunci, dan power bank.",
      price: 329000,
      originalPrice: 419000,
      stock: 35,
      badge: "Favorite",
      isActive: true,
      images: [
        {
          url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=80",
          isPrimary: true,
        },
        {
          url: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=1000&q=80",
          isPrimary: false,
        },
      ],
    },
    {
      categorySlug: "accessories",
      name: "Titanium Minimalist Wallet with Money Clip",
      slug: "titanium-minimalist-wallet",
      description:
        "Dompet kartu saku berpelindung sinyal RFID blocking dengan frame paduan aluminium dan plat titanium aero-grade. Mampu memuat hingga 12 kartu dan klip uang elastis yang ramping di saku celana.",
      price: 219000,
      originalPrice: 289000,
      stock: 45,
      badge: "Diskon 24%",
      isActive: true,
      images: [
        {
          url: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=1000&q=80",
          isPrimary: true,
        },
        {
          url: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1000&q=80",
          isPrimary: false,
        },
      ],
    },
    {
      categorySlug: "electronics",
      name: "AeroPulse Wireless Earbuds ANC",
      slug: "aeropulse-wireless-earbuds-anc",
      description:
        "Earbuds nirkabel dengan Active Noise Cancellation hingga 35dB dan Transparency Mode cerdas. Driver dinamis 11mm memberikan bass bertenaga dan vokal jernih. Total baterai hingga 32 jam bersama case pengisi daya nirkabel Qi.",
      price: 549000,
      originalPrice: 699000,
      stock: 20,
      badge: "Diskon 21%",
      isActive: true,
      images: [
        {
          url: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1000&q=80",
          isPrimary: true,
        },
        {
          url: "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=1000&q=80",
          isPrimary: false,
        },
      ],
    },
    {
      categorySlug: "electronics",
      name: "KeyFlow Mechanical Keyboard 75% Wireless",
      slug: "keyflow-mechanical-keyboard-75",
      description:
        "Keyboard mekanikal 75% hot-swappable dengan gasket mount empuk dan switch pre-lubed linear. Mendukung koneksi Tri-Mode (Bluetooth 5.1, 2.4GHz Dongle, & USB-C). Kompatibel penuh untuk MacOS dan Windows.",
      price: 849000,
      originalPrice: 1099000,
      stock: 15,
      badge: "Premium Pick",
      isActive: true,
      images: [
        {
          url: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1000&q=80",
          isPrimary: true,
        },
        {
          url: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=1000&q=80",
          isPrimary: false,
        },
      ],
    },
    {
      categorySlug: "living",
      name: "Signature Scented Candle - Cedar & Amber",
      slug: "signature-scented-candle-cedar-amber",
      description:
        "Lilin aromaterapi 100% natural soy wax dengan sumbu kayu (wooden wick) yang berderik lembut saat menyala. Perpaduan aroma cedarwood hangat, amber manis, dan sentuhan bergamot segar menenangkan suasana ruang kerja.",
      price: 145000,
      originalPrice: 175000,
      stock: 40,
      badge: "Eksklusif",
      isActive: true,
      images: [
        {
          url: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1000&q=80",
          isPrimary: true,
        },
        {
          url: "https://images.unsplash.com/photo-1570823635306-250abb06d4b3?auto=format&fit=crop&w=1000&q=80",
          isPrimary: false,
        },
      ],
    },
    {
      categorySlug: "living",
      name: "Minimalist Ceramic Pour-Over Coffee Dripper",
      slug: "ceramic-pour-over-coffee-dripper",
      description:
        "Dripper kopi keramik artisanal buatan tangan dengan alur spiral presisi untuk ekstraksi seduhan yang konsisten dan seimbang. Menghadirkan ritual menyeduh kopi manual harian yang elegan di atas cangkir Anda.",
      price: 179000,
      originalPrice: 220000,
      stock: 25,
      badge: "Artisan",
      isActive: true,
      images: [
        {
          url: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1000&q=80",
          isPrimary: true,
        },
        {
          url: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1000&q=80",
          isPrimary: false,
        },
      ],
    },
  ];

  for (const item of productsToSeed) {
    const categoryId = catMap.get(item.categorySlug);

    const [savedProduct] = await db
      .insert(products)
      .values({
        categoryId,
        name: item.name,
        slug: item.slug,
        description: item.description,
        price: item.price,
        originalPrice: item.originalPrice,
        stock: item.stock,
        badge: item.badge,
        isActive: item.isActive,
      })
      .onConflictDoUpdate({
        target: products.slug,
        set: {
          categoryId,
          name: item.name,
          description: item.description,
          price: item.price,
          originalPrice: item.originalPrice,
          stock: item.stock,
          badge: item.badge,
          isActive: item.isActive,
        },
      })
      .returning();

    // Clear old images for this product and re-insert high quality ones
    await db.delete(productImages).where(eq(productImages.productId, savedProduct.id));

    for (const img of item.images) {
      await db.insert(productImages).values({
        productId: savedProduct.id,
        imageUrl: img.url,
        isPrimary: img.isPrimary,
      });
    }
  }

  console.log(`✅ ${productsToSeed.length} products and their gallery images seeded successfully!`);
  console.log("🎉 Database seeding completed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  });
