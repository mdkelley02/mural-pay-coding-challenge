// const createPayoutMethodParams = {
//   alias: "My US Bank Account",
//   payoutMethod: {
//     type: "usd",
//     details: {
//       type: "usdDomestic",
//       symbol: "USD",
//       accountType: "CHECKING",
//       bankAccountNumber: "123456789",
//       bankRoutingNumber: "021000021",
//       transferType: "ACH",
//       bankName: "Chase Bank",
//     },
//   },
// } as const;

async function main() {
  // await muralPayClient
  //   .getCounterpartyById({
  //     id: MURAL_PAY_CONFIG.counterpartyId,
  //     "on-behalf-of": MURAL_PAY_CONFIG.organizationId,
  //   })
  //   .then(({ data }) => console.log("getCounterpartyById:", data))
  //   .catch((error) => console.error("getCounterpartyById:error:", error));
  //
  // await muralPayClient
  //   .searchPayoutMethods({
  //     id: MURAL_PAY_CONFIG.counterpartyId,
  //     "on-behalf-of": MURAL_PAY_CONFIG.organizationId,
  //   })
  //   .then(({ data }) => console.log("searchPayoutMethods:", data))
  //   .catch((error) => console.error("searchPayoutMethods:error:", error));
  //
  // await muralPayClient
  //   .createPayoutMethod(createPayoutMethodParams, {
  //     id: MURAL_PAY_CONFIG.counterpartyId,
  //     "on-behalf-of": MURAL_PAY_CONFIG.organizationId,
  //   })
  //   .then(({ data }) => console.log("createPayoutMethod:", data))
  //   .catch((error) => console.error("createPayoutMethod:error:", error));
  //
  // const createWebhookResp = await muralPayClient.createWebhook({
  //   url: "https://mural-pay-coding-challenge-hvvl-nrekdctcn.vercel.app/api/webhook",
  //   categories: ["MURAL_ACCOUNT_BALANCE_ACTIVITY"],
  // });
  // const updateWebhookResp = await muralPayClient.updateWebhookStatus(
  //   {
  //     status: "ACTIVE",
  //   },
  //   {
  //     webhookId: createWebhookResp.data.id,
  //   }
  // );
}

main();
