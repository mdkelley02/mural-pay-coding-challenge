"use server";

import { getUserIdFromSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CreateOrderPayload, CreateOrderResponse } from "@/types/types";

export async function createOrder(
  payload: CreateOrderPayload
): Promise<CreateOrderResponse> {
  const userId = await getUserIdFromSession();
  if (userId == null) {
    throw new Error("Unauthorized");
  }

  const { items } = payload;

  // 1. Fetch products
  const products = await prisma.product.findMany({
    where: {
      id: { in: items.map((item) => item.productId) },
    },
  });

  // 2. Validation: Ensure no fake IDs were sent
  if (products.length !== items.length) {
    throw new Error(
      "One or more products in the cart are invalid or unavailable."
    );
  }

  // 3. Optimization: Create a Map for O(1) lookups
  // This avoids running .find() repeatedly inside loops
  const productMap = new Map(products.map((p) => [p.id, p]));

  // 4. Compute total using the Map
  const totalAmountUsdc = items.reduce((acc, item) => {
    const product = productMap.get(item.productId);
    if (!product) return acc; // Should be caught by validation above, but safe guard

    return acc + product.priceUsdc * BigInt(item.quantity);
  }, 0n);

  // 6. Create Order
  const order = await prisma.order.create({
    data: {
      userId,
      status: "PENDING",
      totalAmountUsdc,
      items: {
        create: items.map((item) => {
          const product = productMap.get(item.productId)!; // Safe because of Step 2
          return {
            quantity: item.quantity,
            priceUsdc: product.priceUsdc, // Snapshot price at time of order
            product: { connect: { id: item.productId } },
          };
        }),
      },
    },
  });

  return {
    orderId: order.id,
  };
}
