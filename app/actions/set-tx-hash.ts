"use server";

import { prisma } from "@/lib/prisma";

export async function setTxHash(orderId: string, txHash: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });
  if (!order) {
    throw new Error("Order not found");
  }

  await prisma.payment.update({
    where: { orderId },
    data: {
      blockchainTxHash: txHash,
    },
  });
}
