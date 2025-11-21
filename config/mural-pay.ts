export const MURAL_PAY_CONFIG = {
  counterpartyId: process.env.MURAL_PAY_COUNTERPARTY_ID ?? "",
  organizationId: process.env.MURAL_PAY_ORGANIZATION_ID ?? "",
  counterpartyPayoutMethodId: process.env.MURAL_PAY_PAYOUT_METHOD_ID ?? "",
  accountId: process.env.MURAL_PAY_ACCOUNT_ID ?? "",
  apiKey: process.env.MURAL_PAY_API_KEY ?? "",
  transferApiKey: process.env.MURAL_PAY_TRANSFER_API_KEY ?? "",
  baseUrl: process.env.MURAL_PAY_BASE_URL ?? "",
  webhookKey: {
    key: process.env.MURAL_PAY_WEBHOOK_PUBLIC_KEY ?? "",
    dsaEncoding: "der",
  },
  usdcContractAddress: (process.env.NEXT_PUBLIC_USDC_CONTRACT_ADDRESS ??
    "") as `0x${string}`,
  accountWalletAddress: (process.env
    .NEXT_PUBLIC_MURAL_PAY_ACCOUNT_WALLET_ADDRESS ?? "") as `0x${string}`,
} as const;
