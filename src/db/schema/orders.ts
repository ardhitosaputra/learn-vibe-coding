import { pgTable, uuid, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { profiles } from "./profiles";

export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderNumber: varchar("order_number", { length: 50 }).notNull().unique(), // misal: ORD-20261016-ABCD
  userId: uuid("user_id").references(() => profiles.id, { onDelete: "set null" }),
  customerName: varchar("customer_name", { length: 255 }).notNull(),
  customerEmail: varchar("customer_email", { length: 255 }).notNull(),
  customerPhone: varchar("customer_phone", { length: 50 }),
  shippingAddress: varchar("shipping_address", { length: 500 }),
  totalAmount: integer("total_amount").notNull(),
  shippingCost: integer("shipping_cost").default(0).notNull(),
  status: varchar("status", { length: 30 }).default("pending").notNull(), // 'pending' | 'paid' | 'shipped' | 'cancelled'
  snapToken: varchar("snap_token", { length: 255 }), // Token Midtrans Snap
  paymentType: varchar("payment_type", { length: 50 }), // e.g., 'qris', 'bank_transfer'
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
