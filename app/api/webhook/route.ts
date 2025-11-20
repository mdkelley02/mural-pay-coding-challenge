import {
  accountCreditedSchema,
  isWebhookSignatureValid,
} from "@/app/api/webhook/validation";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get("x-mural-webhook-signature") ?? "";
    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 401 });
    }

    const timestamp = request.headers.get("x-mural-webhook-timestamp") ?? "";
    if (!timestamp) {
      return NextResponse.json({ error: "Invalid request" }, { status: 401 });
    }

    const body = await request.json();
    if (!isWebhookSignatureValid(JSON.stringify(body), signature, timestamp)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("body", body);

    const parsedBody = accountCreditedSchema.safeParse(body);
    if (!parsedBody.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 401 });
    }

    // get order by transaction hash
    const order = await prisma.order.findFirst({
      where: {
        payment: {
          blockchainTxHash: parsedBody.data.transactionDetails.transactionHash,
        },
      },
    });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // TODO: Validate payment amount before updating order status to paid

    // update order status to paid
    await prisma.order.update({
      where: { id: order.id },
      data: { status: "PAID" },
    });

    // TODO:Initiate withdrawal from muralPay
    // await muralPayClient.createPayoutRequest({
    //   sourceAccountId: MURAL_PAY_CONFIG.accountId,
    //   payouts: [],
    // });

    return NextResponse.json({ message: "Ok" }, { status: 200 });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
