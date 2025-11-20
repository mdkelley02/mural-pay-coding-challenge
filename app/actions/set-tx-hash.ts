"use server";

import { prisma } from "@/lib/prisma";

export async function setTxHash(orderId: string, txHash: string) {
  await prisma.payment.update({
    where: { orderId },
    data: {
      blockchainTxHash: txHash,
    },
  });
}
