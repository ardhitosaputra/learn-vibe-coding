import { db } from "@/db";
import { categories, products, productImages } from "@/db/schema";
import { and, desc, asc, eq, ilike, or, gte, lte, sql } from "drizzle-orm";

export interface CatalogFilterParams {
  category?: string;
  q?: string;
  sort?: "newest" | "price-asc" | "price-desc" | "name-asc";
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

/**
 * Fetch all categories with total product counts
 */
export async function getCategories() {
  const result = await db.query.categories.findMany({
    orderBy: [asc(categories.name)],
    with: {
      products: {
        where: eq(products.isActive, true),
        columns: {
          id: true,
        },
      },
    },
  });

  return result.map((cat) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    description: cat.description,
    imageUrl: cat.imageUrl,
    productCount: cat.products.length,
  }));
}

/**
 * Fetch featured products for the Home Page
 */
export async function getFeaturedProducts(limit = 4) {
  return await db.query.products.findMany({
    where: eq(products.isActive, true),
    orderBy: [desc(products.createdAt)],
    limit,
    with: {
      category: true,
      images: {
        orderBy: [desc(productImages.isPrimary), asc(productImages.createdAt)],
      },
    },
  });
}

/**
 * Fetch catalog products with search, category filtering, price range, and sorting
 */
export async function getCatalogProducts({
  category,
  q,
  sort = "newest",
  minPrice,
  maxPrice,
  page = 1,
  limit = 12,
}: CatalogFilterParams) {
  const conditions = [eq(products.isActive, true)];

  // Category filter by slug
  if (category && category !== "all") {
    const targetCategory = await db.query.categories.findFirst({
      where: eq(categories.slug, category),
    });

    if (targetCategory) {
      conditions.push(eq(products.categoryId, targetCategory.id));
    }
  }

  // Keyword Search (name or description)
  if (q && q.trim().length > 0) {
    const searchPattern = `%${q.trim()}%`;
    conditions.push(
      or(
        ilike(products.name, searchPattern),
        ilike(products.description, searchPattern)
      )!
    );
  }

  // Price filters
  if (minPrice !== undefined && !isNaN(minPrice) && minPrice > 0) {
    conditions.push(gte(products.price, minPrice));
  }
  if (maxPrice !== undefined && !isNaN(maxPrice) && maxPrice > 0) {
    conditions.push(lte(products.price, maxPrice));
  }

  // Determine sorting order
  let orderByClause = desc(products.createdAt);
  if (sort === "price-asc") {
    orderByClause = asc(products.price);
  } else if (sort === "price-desc") {
    orderByClause = desc(products.price);
  } else if (sort === "name-asc") {
    orderByClause = asc(products.name);
  }

  const offset = (page - 1) * limit;

  // Run data fetch and total count query concurrently
  const [items, totalResult] = await Promise.all([
    db.query.products.findMany({
      where: and(...conditions),
      orderBy: [orderByClause],
      limit,
      offset,
      with: {
        category: true,
        images: {
          orderBy: [desc(productImages.isPrimary), asc(productImages.createdAt)],
        },
      },
    }),
    db
      .select({ count: sql<number>`count(*)` })
      .from(products)
      .where(and(...conditions)),
  ]);

  const total = Number(totalResult[0]?.count ?? 0);
  const totalPages = Math.ceil(total / limit);

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}

/**
 * Fetch a single product by slug with all images and category
 */
export async function getProductBySlug(slug: string) {
  return await db.query.products.findFirst({
    where: and(eq(products.slug, slug), eq(products.isActive, true)),
    with: {
      category: true,
      images: {
        orderBy: [desc(productImages.isPrimary), asc(productImages.createdAt)],
      },
    },
  });
}

/**
 * Fetch related products in the same category
 */
export async function getRelatedProducts(
  categoryId: string | null | undefined,
  currentProductId: string,
  limit = 4
) {
  if (!categoryId) return [];

  return await db.query.products.findMany({
    where: and(
      eq(products.categoryId, categoryId),
      eq(products.isActive, true),
      sql`${products.id} != ${currentProductId}`
    ),
    orderBy: [desc(products.createdAt)],
    limit,
    with: {
      category: true,
      images: {
        orderBy: [desc(productImages.isPrimary), asc(productImages.createdAt)],
      },
    },
  });
}
