import { pgTable, uuid, integer } from "drizzle-orm/pg-core";
import { orders } from "./orders";
import { products } from "./products";

export const orderItems = pgTable("order_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id")
    .references(() => orders.id, { onDelete: "cascade" })
    .notNull(),
  productId: uuid("product_id")
    .references(() => products.id, { onDelete: "set null" }),
  quantity: integer("quantity").notNull(),
  unitPrice: integer("unit_price").notNull(), // Harga satuan pada saat checkout
  subtotal: integer("subtotal").notNull(), // quantity * unitPrice
});

export type OrderItem = typeof orderItems.$inferSelect;
export type NewOrderItem = typeof orderItems.$inferInsert;
