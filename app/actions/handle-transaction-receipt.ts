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

  try {
    const createPayoutRequestResp = await muralPayClient.createPayoutRequest({
      sourceAccountId: MURAL_PAY_CONFIG.accountId,
      payouts: [
        {
          amount: {
            tokenSymbol: "USDC",
            tokenAmount: Number(order.totalAmountUsdc) / 1_000_000,
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
  } catch (error) {
    console.error(
      `Failed to handle transaction receipt for order ${orderId}, error: ${JSON.stringify(
        error
      )}`
    );
    throw new Error(`Failed to create payout request on order ${orderId}`);
  }
}
