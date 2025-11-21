import { MURAL_PAY_CONFIG } from "@/config/mural-pay";
import { verify } from "crypto";
import { z } from "zod";

// https://developers.muralpay.com/v1.28/docs/event-types
export const accountCreditedSchema = z.object({
  eventId: z.string(),
  deliveryId: z.string(),
  attemptNumber: z.number(),
  eventCategory: z.literal("MURAL_ACCOUNT_BALANCE_ACTIVITY"),
  occuredAt: z.string(),
  payload: z.object({
    type: z.literal("account_credited"),
    accountId: z.string(),
    organizationId: z.string(),
    transactionId: z.string(),
    accountWalletAddress: z.string(),
    tokenAmount: z.object({
      blockchain: z.string(),
      tokenAmount: z.number(),
      tokenSymbol: z.string(),
    }),
    transactionDetails: z.object({
      blockchain: z.string(),
      transactionDate: z.string(),
      transactionHash: z.string(),
      sourceWalletAddress: z.string(),
      destinationWalletAddress: z.string(),
    }),
  }),
});

export function isWebhookSignatureValid(
  requestBody: string,
  signature: string,
  timestamp: string
): boolean {
  // https://developers.muralpay.com/docs/signature-validation
  try {
    return verify(
      "sha256",
      Buffer.from(`${new Date(timestamp).toISOString()}.${requestBody}`),
      MURAL_PAY_CONFIG.webhookKey,
      Buffer.from(signature, "base64")
    );
  } catch (error) {
    console.error("Signature verification failed:", error);
    return false;
  }
}
