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
      console.error("Missing headers", signature, timestamp);
      return NextResponse.json({ error: "Missing headers" }, { status: 401 });
    }

    const body = await request.json();
    console.log("received webhook", JSON.stringify(body, null, 2));

    if (!isWebhookSignatureValid(JSON.stringify(body), signature, timestamp)) {
      console.error("Invalid signature", signature, timestamp);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const parsedBody = accountCreditedSchema.safeParse(body);
    if (!parsedBody.success) {
      console.error("Invalid schema", parsedBody.error);
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
  // Find the order by the blockchain transaction hash
  const blockchainTxHash = body.payload.transactionDetails.transactionHash;
  const order = await prisma.order.findFirst({
    where: { blockchainTxHash },
  });
  if (order == null) {
    console.error(`Order not found for hash: ${blockchainTxHash}`);
    return NextResponse.json({ message: "Order not found" }, { status: 404 });
  } else if (order.status === "PAID") {
    return NextResponse.json({ message: "Already processed" }, { status: 200 });
  }

  if (!order.muralPayPayoutRequestId) {
    console.error(`Payout request ID not found for Order #${order.id}`);
    return NextResponse.json(
      { message: "Payout request ID not found" },
      { status: 404 }
    );
  }

  const orderTotalAmountUsdc = Number(order.totalAmountUsdc) / 1_000_000;
  if (orderTotalAmountUsdc !== body.payload.tokenAmount.tokenAmount) {
    console.error(
      `Amount mismatch for Order #${order.id}. Expected: ${orderTotalAmountUsdc}, Received: ${body.payload.tokenAmount.tokenAmount}`
    );

    await prisma.order.update({
      where: { id: order.id },
      data: { status: "PAYMENT_MISMATCH" },
    });

    return NextResponse.json({ message: "Amount mismatch" }, { status: 200 });
  }

  // Execute the payout request
  const executePayoutRequestResp = await muralPayClient.executePayoutRequest(
    {},
    {
      id: order.muralPayPayoutRequestId,
      "on-behalf-of": MURAL_PAY_CONFIG.organizationId,
      "transfer-api-key": MURAL_PAY_CONFIG.transferApiKey,
    }
  );

  const fiatAmountDetails = executePayoutRequestResp.data.payouts[0].details
    .fiatAmount as unknown as {
    fiatAmount: number;
  };

  // Update the order status to PAID
  await prisma.order.update({
    where: { id: order.id },
    data: {
      status: "PAID",
      payoutStatus: executePayoutRequestResp.data.status,
      payoutAmountUsd: fiatAmountDetails.fiatAmount,
    },
  });

  return NextResponse.json({ message: "Ok" }, { status: 200 });
}
