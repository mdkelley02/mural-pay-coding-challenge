"use server";

import { MURAL_PAY_CONFIG } from "@/config/mural-pay";
import { getUserIdFromSession } from "@/lib/auth";
import muralPayClient from "@/lib/mural-pay";
import { prisma } from "@/lib/prisma";

export async function handleTransactionReceipt(
  orderId: string,
  blockchainTxHash: string
): Promise<void> {
  const userId = await getUserIdFromSession();
  if (userId == null) {
    throw new Error("Unauthorized");
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId, userId },
  });
  if (order == null) {
    throw new Error("Order not found");
  }

  // 5. Create Payout Request
  const createPayoutRequestResp = await muralPayClient.createPayoutRequest({
    sourceAccountId: MURAL_PAY_CONFIG.accountId,
    payouts: [
      {
        amount: {
          tokenSymbol: "USDC",
          tokenAmount: Number(order.totalAmountUsdc),
        },
        recipientInfo: {
          type: "counterpartyInfo",
          counterpartyId: MURAL_PAY_CONFIG.counterpartyId,
        },
        payoutDetails: {
          type: "counterpartyPayoutMethod",
          payoutMethodId: MURAL_PAY_CONFIG.counterpartyPayoutMethodId,
        },
      },
    ],
  });

  if (createPayoutRequestResp.data.payouts.length === 0) {
    throw new Error("No payouts created");
  }

  await prisma.order.update({
    where: { id: orderId, userId },
    data: {
      blockchainTxHash,
      muralPayPayoutRequestId: createPayoutRequestResp.data.id,
      muralPayPayoutId: createPayoutRequestResp.data.payouts[0].id,
    },
  });
}
