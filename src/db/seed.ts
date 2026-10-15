import { config } from "dotenv";
config({ path: ".env.local" });

import { db } from "./index";
import { categories, products, productImages } from "./schema";

async function main() {
  console.log("🌱 Starting database seeding...");

  if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes("127.0.0.1")) {
    console.warn(
      "⚠️ DATABASE_URL belum diarahkan ke database cloud Supabase aktif. Lewati eksekusi jaringan."
    );
    console.log(
      "💡 Hubungkan connection string Supabase Anda ke .env.local untuk menjalankan seed ke database live."
    );
    return;
  }

  // 1. Seed Categories
  console.log("1️⃣ Seeding categories...");
  const [apparel, accessories, electronics, living] = await db
    .insert(categories)
    .values([
      {
        name: "Apparel",
        slug: "apparel",
        description: "Pakaian kurasi eksklusif dengan kenyamanan maksimal.",
      },
      {
        name: "Accessories",
        slug: "accessories",
        description: "Aksesoris harian dan perlengkapan EDC modern.",
      },
      {
        name: "Electronics",
        slug: "electronics",
        description: "Perangkat audio dan gadget premium untuk produktivitas.",
      },
      {
        name: "Living",
        slug: "living",
        description: "Dekorasi dan aromaterapi penunjang suasana hunian.",
      },
    ])
    .onConflictDoNothing({ target: categories.slug })
    .returning();

  console.log("✅ Categories seeded successfully!");

  // 2. Seed Products
  console.log("2️⃣ Seeding products...");
  const insertedProducts = await db
    .insert(products)
    .values([
      {
        categoryId: apparel?.id,
        name: "Minimalist Oversized Tee - Onyx Edition",
        slug: "minimalist-oversized-tee-onyx",
        description: "Katun combed 24s ultra-soft dengan potongan modern drop-shoulder nyaman untuk harian.",
        price: 189000,
        originalPrice: 249000,
        stock: 50,
        badge: "Best Seller",
        isActive: true,
      },
      {
        categoryId: accessories?.id,
        name: "Urban Carry EDC Sling Bag Waterproof",
        slug: "urban-carry-edc-sling-bag",
        description: "Material Cordura water-resistant dengan kompartemen aman untuk tablet & aksesoris.",
        price: 329000,
        originalPrice: 419000,
        stock: 35,
        badge: "New Arrival",
        isActive: true,
      },
      {
        categoryId: electronics?.id,
        name: "AeroPulse Wireless Earbuds ANC",
        slug: "aeropulse-wireless-earbuds-anc",
        description: "Active Noise Cancellation hingga 35dB dengan bass punchy dan baterai tahan 32 jam.",
        price: 549000,
        originalPrice: 699000,
        stock: 20,
        badge: "Diskon 21%",
        isActive: true,
      },
      {
        categoryId: living?.id,
        name: "Signature Scented Candle - Cedar & Amber",
        slug: "signature-scented-candle-cedar-amber",
        description: "100% natural soy wax dengan aroma kayu cedarwood menenangkan untuk ruang kerja.",
        price: 145000,
        originalPrice: 175000,
        stock: 40,
        badge: "Eksklusif",
        isActive: true,
      },
    ])
    .onConflictDoNothing({ target: products.slug })
    .returning();

  console.log(`✅ ${insertedProducts.length} products seeded successfully!`);

  // 3. Seed Primary Images Placeholder
  console.log("3️⃣ Seeding product images...");
  for (const prod of insertedProducts) {
    await db.insert(productImages).values({
      productId: prod.id,
      imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
      isPrimary: true,
    });
  }

  console.log("🎉 Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  });
