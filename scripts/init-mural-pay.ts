import muralPayClient from "@/lib/mural-pay";

async function main() {
  await muralPayClient
    .searchCounterparties({
      "on-behalf-of": "43b81833-5f8d-4036-bbd1-fdb06ccfd468",
    })
    .then(({ data }) => console.log(data.results))
    .catch((err) => console.error(`Failed to search counterparties: ${err}`));

  // [
  //   {
  //     id: '9b6142ed-bff3-4d62-93b5-22dea0fdb47f',
  //     createdAt: '2025-11-20T04:05:59.349Z',
  //     updatedAt: '2025-11-20T04:05:59.349Z',
  //     type: 'business',
  //     name: 'Merchant Inc. Counterparty',
  //     email: 'merchant.inc.counterparty@example.com',
  //     physicalAddress: {
  //       address1: 'Calle 45 #52 - 20',
  //       address2: 'Edificio El Cafetal, Oficina 501',
  //       country: 'CO',
  //       state: 'ANT',
  //       city: 'Medellín',
  //       zip: '050010'
  //     }
  //   }
  // ]

  await muralPayClient
    .searchPayoutMethods({
      "on-behalf-of": "43b81833-5f8d-4036-bbd1-fdb06ccfd468", // organization id
      id: "9b6142ed-bff3-4d62-93b5-22dea0fdb47f", // counterparty id
    })
    .then(({ data }) => console.log(data.results))
    .catch((err) => console.error(`Failed to search payout methods: ${err}`));
  // Failed to search payout methods: FetchError: Internal Server Error

  await muralPayClient
    .createPayoutMethod(
      {
        alias: "Merchant Inc. COP Payout Method",
        payoutMethod: {
          type: "cop",
          details: {
            type: "copDomestic",
            symbol: "COP",
            accountType: "CHECKING",
            documentType: "NATIONAL_ID",
            bankId: "bank_cop_001",
            bankAccountNumber: "1234567890",
            documentNumber: "1234567890",
            phoneNumber: "+573178901234",
          },
        },
      },
      {
        "on-behalf-of": "43b81833-5f8d-4036-bbd1-fdb06ccfd468", // organization id
        id: "9b6142ed-bff3-4d62-93b5-22dea0fdb47f", // counterparty id
      }
    )
    .then(({ data }) => console.log(data))
    .catch((err) => console.error(`Failed to create payout method: ${err}`));
  // Failed to create payout method: FetchError: Internal Server Error
}

main();
