import { relations } from "drizzle-orm";
import { profiles } from "./profiles";
import { categories } from "./categories";
import { products } from "./products";
import { productImages } from "./product-images";
import { orders } from "./orders";
import { orderItems } from "./order-items";

// Re-export all tables and types
export * from "./profiles";
export * from "./categories";
export * from "./products";
export * from "./product-images";
export * from "./orders";
export * from "./order-items";

// Define Drizzle Relations for fluent joins (db.query.*.findMany({ with: { ... } }))
export const profilesRelations = relations(profiles, ({ many }) => ({
  orders: many(orders),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  images: many(productImages),
  orderItems: many(orderItems),
}));

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(profiles, {
    fields: [orders.userId],
    references: [profiles.id],
  }),
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));
