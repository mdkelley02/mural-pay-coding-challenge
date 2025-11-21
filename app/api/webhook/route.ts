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
    const signature = request.headers.get("x-mural-webhook-signature") ?? "";
    const timestamp = request.headers.get("x-mural-webhook-timestamp") ?? "";
    if (!signature || !timestamp) {
      return NextResponse.json({ error: "Missing headers" }, { status: 401 });
    }

    const body = await request.json();

    console.log("received webhook", body);

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
  const blockchainTxHash = body.payload.transactionDetails.transactionHash;
  const receivedAmountUsdc = BigInt(body.payload.tokenAmount.tokenAmount);

  // 1. Find the order by the blockchain transaction hash
  const order = await prisma.order.findFirst({
    where: {
      blockchainTxHash: blockchainTxHash,
    },
  });
  if (!order) {
    console.error(
      `[Webhook Failed] Order not found for hash: ${blockchainTxHash}`
    );
    return NextResponse.json(
      { message: "Order not found, ignored" },
      { status: 200 }
    );
  } else if (!order.muralPayPayoutId) {
    // If the payout request is not found
    console.error(
      `[Webhook Failed] Payout request not found for Order #${order.id}`
    );
    return NextResponse.json(
      { message: "Payout request not found, ignored" },
      { status: 200 }
    );
  } else if (order.status === "PAID") {
    // If we already paid this
    return NextResponse.json({ message: "Already processed" }, { status: 200 });
  } else if (order.totalAmountUsdc !== receivedAmountUsdc) {
    // If the amount mismatch, update the order status to PAYMENT_MISMATCH
    console.error(
      `[Webhook Failed] Amount mismatch for Order #${order.id}. Expected: ${order.totalAmountUsdc}, Received: ${receivedAmountUsdc}`
    );

    await prisma.order.update({
      where: { id: order.id },
      data: { status: "PAYMENT_MISMATCH" },
    });

    return NextResponse.json(
      { message: "Amount mismatch, updating order status to PAYMENT_MISMATCH" },
      { status: 200 }
    );
  }

  try {
    // 2. Execute the payout request
    const executePayoutRequestResp = await muralPayClient.executePayoutRequest(
      {},
      {
        id: order.muralPayPayoutId,
        "on-behalf-of": MURAL_PAY_CONFIG.organizationId,
        "transfer-api-key": MURAL_PAY_CONFIG.transferApiKey,
      }
    );

    // Note: This type is unknown
    const fiatAmountDetails = executePayoutRequestResp.data.payouts[0].details
      .fiatAmount as unknown as {
      fiatAmount: number;
    };

    // 3. Update the order status to PAID
    await prisma.order.update({
      where: { id: order.id },
      data: {
        status: "PAID",
        payoutStatus: executePayoutRequestResp.data.status,
        payoutAmountUsd: fiatAmountDetails.fiatAmount,
      },
    });
  } catch (error) {
    // If the payout request fails, update the order status to PENDING
    console.error("Payout API failed", error);

    await prisma.order.update({
      where: { id: order.id },
      data: { status: "PENDING" },
    });

    throw error;
  }

  return NextResponse.json({ message: "Ok" }, { status: 200 });
}
