"use server";

import { prisma } from "@/lib/prisma";
import { CreateOrderPayload, CreateOrderResponse } from "@/types/types";

export async function createOrder(
  payload: CreateOrderPayload
): Promise<CreateOrderResponse> {
  const products = await prisma.product.findMany({
    where: {
      id: {
        in: payload.items.map((item) => item.productId),
      },
    },
  });

  if (products.length !== payload.items.length) {
    throw new Error("One or more products not found");
  }

  const totalAmount = BigInt(
    products.reduce((acc, product) => {
      return (
        acc +
        Number(product.priceUsdc) *
          (payload.items.find((item) => item.productId === product.id)
            ?.quantity ?? 0)
      );
    }, 0)
  );

  const order = await prisma.order.create({
    data: {
      status: "PENDING",
      totalAmount: totalAmount,
      customerEmail: payload.customerEmail,
      items: {
        create: payload.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price:
            products.find((product) => product.id === item.productId)
              ?.priceUsdc ?? 0,
        })),
      },
    },
  });

  return {
    orderId: order.id,
  };
}
