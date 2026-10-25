"use server";

import { db } from "@/db";
import { orders, orderItems, products } from "@/db/schema";
import { getCurrentUser } from "@/actions/auth";
import { inArray, eq } from "drizzle-orm";

export interface CreateOrderInput {
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  courier: string;
  shippingCost: number;
  voucherCode?: string;
}

export interface CreateOrderResult {
  success?: boolean;
  orderId?: string;
  orderNumber?: string;
  totalAmount?: number;
  error?: string;
}

export async function createDraftOrder(
  data: CreateOrderInput
): Promise<CreateOrderResult> {
  try {
    // 1. Authenticate user
    const authData = await getCurrentUser();
    if (!authData) {
      return {
        error: "Silakan masuk (login) terlebih dahulu untuk melanjutkan proses checkout.",
      };
    }

    const { user, profile } = authData;

    // 2. Validate items array
    if (!data.items || data.items.length === 0) {
      return { error: "Keranjang belanja Anda kosong." };
    }

    // 3. Fetch verified product prices and stocks from database
    const productIds = data.items.map((i) => i.productId);
    const dbProducts = await db
      .select()
      .from(products)
      .where(inArray(products.id, productIds));

    const productMap = new Map(dbProducts.map((p) => [p.id, p]));

    // Validate each item and calculate verified server-side subtotal
    let verifiedSubtotal = 0;
    const validatedItems: Array<{
      productId: string;
      quantity: number;
      unitPrice: number;
      subtotal: number;
    }> = [];

    for (const item of data.items) {
      const dbProduct = productMap.get(item.productId);
      if (!dbProduct || !dbProduct.isActive) {
        return {
          error: `Salah satu produk yang dipilih sudah tidak tersedia atau dinonaktifkan.`,
        };
      }

      if (dbProduct.stock < item.quantity) {
        return {
          error: `Stok produk "${dbProduct.name}" tersisa ${dbProduct.stock} unit, tidak mencukupi untuk jumlah yang diminta.`,
        };
      }

      const itemSubtotal = dbProduct.price * item.quantity;
      verifiedSubtotal += itemSubtotal;

      validatedItems.push({
        productId: dbProduct.id,
        quantity: item.quantity,
        unitPrice: dbProduct.price,
        subtotal: itemSubtotal,
      });
    }

    // 4. Calculate discount if voucher is valid
    let discountAmount = 0;
    if (data.voucherCode && data.voucherCode.trim().toUpperCase() === "STOREFIRST") {
      // 20% discount on products subtotal
      discountAmount = Math.round(verifiedSubtotal * 0.2);
    }

    const validatedShippingCost = Math.max(0, data.shippingCost || 0);
    const finalTotalAmount = Math.max(
      0,
      verifiedSubtotal + validatedShippingCost - discountAmount
    );

    // 5. Generate formatted Order Number: ORD-YYYYMMDD-XXXX
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomHex = Math.random().toString(36).substring(2, 6).toUpperCase();
    const orderNumber = `ORD-${dateStr}-${randomHex}`;

    // Full shipping address text
    const fullShippingInfo = `${data.shippingAddress} (Kurir: ${data.courier})`;

    // 6. Insert Order into database
    const [newOrder] = await db
      .insert(orders)
      .values({
        orderNumber,
        userId: profile?.id || user.id,
        customerName: data.customerName.trim(),
        customerEmail: data.customerEmail.trim(),
        customerPhone: data.customerPhone.trim(),
        shippingAddress: fullShippingInfo,
        totalAmount: finalTotalAmount,
        shippingCost: validatedShippingCost,
        status: "pending",
      })
      .returning();

    // 7. Insert Order Items
    const itemsToInsert = validatedItems.map((v) => ({
      orderId: newOrder.id,
      productId: v.productId,
      quantity: v.quantity,
      unitPrice: v.unitPrice,
      subtotal: v.subtotal,
    }));

    await db.insert(orderItems).values(itemsToInsert);

    return {
      success: true,
      orderId: newOrder.id,
      orderNumber: newOrder.orderNumber,
      totalAmount: finalTotalAmount,
    };
  } catch (error) {
    console.error("❌ Failed to create draft order:", error);
    return {
      error:
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan internal saat membuat pesanan. Silakan coba lagi.",
    };
  }
}
