import {
  accountCreditedSchema,
  isWebhookSignatureValid,
} from "@/app/api/webhook/validation";
import { MURAL_PAY_CONFIG } from "@/config/mural-pay";
import muralPayClient from "@/lib/mural-pay";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function POST(request: NextRequest) {
  try {
    // --- PROTOCOL VALIDATION (Keep these as 401/400) ---
    const signature = request.headers.get("x-mural-webhook-signature") ?? "";
    const timestamp = request.headers.get("x-mural-webhook-timestamp") ?? "";

    if (!signature || !timestamp) {
      return NextResponse.json({ error: "Missing headers" }, { status: 401 });
    }

    const body = await request.json();

    // If the signature is wrong, reject it (Security)
    if (!isWebhookSignatureValid(JSON.stringify(body), signature, timestamp)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const parsedBody = accountCreditedSchema.safeParse(body);
    if (!parsedBody.success) {
      return NextResponse.json({ error: "Invalid schema" }, { status: 400 });
    }

    return handleAccountCreditedEvent(parsedBody.data);
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function handleAccountCreditedEvent(
  body: z.infer<typeof accountCreditedSchema>
): Promise<NextResponse> {
  const txHash = body.transactionDetails.transactionHash;
  const receivedAmount = BigInt(body.tokenAmount.tokenAmount);

  const order = await prisma.order.findFirst({
    where: {
      payment: { blockchainTxHash: txHash },
    },
  });
  if (!order) {
    console.error(`[Webhook Failed] Order not found for hash: ${txHash}`);
    return NextResponse.json(
      { message: "Order not found, ignored" },
      { status: 200 }
    );
  }

  // If we already paid this
  if (order.status === "PAID") {
    return NextResponse.json({ message: "Already processed" }, { status: 200 });
  }

  // If the amount mismatch, update the order status to PAYMENT_MISMATCH
  if (order.totalAmount !== receivedAmount) {
    console.error(
      `[Webhook Failed] Amount mismatch for Order #${order.id}. Expected: ${order.totalAmount}, Received: ${receivedAmount}`
    );

    await prisma.order.update({
      where: { id: order.id },
      data: { status: "PAYMENT_MISMATCH" },
    });

    return NextResponse.json(
      { message: "Amount mismatch, ignored" },
      { status: 200 }
    );
  }

  // Update the order status to PAID
  await prisma.order.update({
    where: { id: order.id },
    data: { status: "PAID" },
  });

  try {
    await muralPayClient.createPayoutRequest({
      sourceAccountId: MURAL_PAY_CONFIG.accountId,
      memo: `Payout for order #${order.id}`,
      payouts: [
        {
          amount: {
            tokenSymbol: "USDC",
            tokenAmount: Number(order.totalAmount),
          },
          recipientInfo: {
            type: "counterpartyInfo",
            counterpartyId: MURAL_PAY_CONFIG.counterpartyId,
          },
          payoutDetails: {
            type: "counterpartyPayoutMethod",
            payoutMethodId: MURAL_PAY_CONFIG.payoutMethodId,
          },
        },
      ],
    });
  } catch (error) {
    console.error("Payout API failed", error);

    await prisma.order.update({
      where: { id: order.id },
      data: { status: "PENDING" },
    });

    throw error;
  }

  return NextResponse.json({ message: "Ok" }, { status: 200 });
}
