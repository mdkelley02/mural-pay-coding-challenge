import type * as types from './types';
import type { ConfigOptions, FetchResponse } from 'api/dist/core'
import Oas from 'oas';
import APICore from 'api/dist/core';
import definition from './openapi.json';

class SDK {
  spec: Oas;
  core: APICore;

  constructor() {
    this.spec = Oas.init(definition);
    this.core = new APICore(this.spec, 'mural-production/1.0 (api/6.1.3)');
  }

  /**
   * Optionally configure various options that the SDK allows.
   *
   * @param config Object of supported SDK options and toggles.
   * @param config.timeout Override the default `fetch` request timeout of 30 seconds. This number
   * should be represented in milliseconds.
   */
  config(config: ConfigOptions) {
    this.core.setConfig(config);
  }

  /**
   * If the API you're using requires authentication you can supply the required credentials
   * through this method and the library will magically determine how they should be used
   * within your API request.
   *
   * With the exception of OpenID and MutualTLS, it supports all forms of authentication
   * supported by the OpenAPI specification.
   *
   * @example <caption>HTTP Basic auth</caption>
   * sdk.auth('username', 'password');
   *
   * @example <caption>Bearer tokens (HTTP or OAuth 2)</caption>
   * sdk.auth('myBearerToken');
   *
   * @example <caption>API Keys</caption>
   * sdk.auth('myApiKey');
   *
   * @see {@link https://spec.openapis.org/oas/v3.0.3#fixed-fields-22}
   * @see {@link https://spec.openapis.org/oas/v3.1.0#fixed-fields-22}
   * @param values Your auth credentials for the API; can specify up to two strings or numbers.
   */
  auth(...values: string[] | number[]) {
    this.core.setAuth(...values);
    return this;
  }

  /**
   * If the API you're using offers alternate server URLs, and server variables, you can tell
   * the SDK which one to use with this method. To use it you can supply either one of the
   * server URLs that are contained within the OpenAPI definition (along with any server
   * variables), or you can pass it a fully qualified URL to use (that may or may not exist
   * within the OpenAPI definition).
   *
   * @example <caption>Server URL with server variables</caption>
   * sdk.server('https://{region}.api.example.com/{basePath}', {
   *   name: 'eu',
   *   basePath: 'v14',
   * });
   *
   * @example <caption>Fully qualified server URL</caption>
   * sdk.server('https://eu.api.example.com/v14');
   *
   * @param url Server URL
   * @param variables An object of variables to replace into the server URL.
   */
  server(url: string, variables = {}) {
    this.core.setServer(url, variables);
  }

  /**
   * Get all Accounts associated with the provided Organization ID
   *
   * @summary Get all Accounts
   */
  getAccounts(metadata?: types.GetAccountsMetadataParam): Promise<FetchResponse<200, types.GetAccountsResponse200>> {
    return this.core.fetch('/api/accounts', 'get', metadata);
  }

  /**
   * Creates a Mural Account that you can deposit funds into and perform payouts from.
   *
   * @summary Create an Account
   */
  createAccount(body: types.CreateAccountBodyParam, metadata?: types.CreateAccountMetadataParam): Promise<FetchResponse<200, types.CreateAccountResponse200>> {
    return this.core.fetch('/api/accounts', 'post', body, metadata);
  }

  /**
   * Get an Account identified by the provided ID.
   *
   * @summary Get an Account
   */
  getAccount(metadata: types.GetAccountMetadataParam): Promise<FetchResponse<200, types.GetAccountResponse200>> {
    return this.core.fetch('/api/accounts/{id}', 'get', metadata);
  }

  /**
   * Sets or updates the developer fee configurations for a specific Account. Multiple
   * currencies can be configured in a single request.
   *
   * @summary Set developer fees for an Account
   */
  setDeveloperFees(body: types.SetDeveloperFeesBodyParam, metadata: types.SetDeveloperFeesMetadataParam): Promise<FetchResponse<200, types.SetDeveloperFeesResponse200>> {
    return this.core.fetch('/api/accounts/{id}/set-developer-fees', 'put', body, metadata);
  }

  /**
   * Initiates an email challenge to validate the action of an approver. This endpoint should
   * only be used in end-user custodial payout flows.
   *
   * @summary Initiate an end-user custodial challenge for an approver
   */
  initiateEndUserCustodialChallenge(body: types.InitiateEndUserCustodialChallengeBodyParam, metadata: types.InitiateEndUserCustodialChallengeMetadataParam): Promise<FetchResponse<200, types.InitiateEndUserCustodialChallengeResponse200>> {
    return this.core.fetch('/api/approvers/end-user-custodial/initiate-challenge', 'post', body, metadata);
  }

  /**
   * Creates a new counterparty (recipient) that can be referenced in future payouts. The
   * counterparty information is stored and can be reused across multiple payout requests.
   *
   * @summary Create a Counterparty
   */
  createCounterparty(body: types.CreateCounterpartyBodyParam, metadata?: types.CreateCounterpartyMetadataParam): Promise<FetchResponse<201, types.CreateCounterpartyResponse201>> {
    return this.core.fetch('/api/counterparties', 'post', body, metadata);
  }

  /**
   * Retrieves a single counterparty by ID.
   *
   * @summary Get a Counterparty
   */
  getCounterpartyById(metadata: types.GetCounterpartyByIdMetadataParam): Promise<FetchResponse<200, types.GetCounterpartyByIdResponse200>> {
    return this.core.fetch('/api/counterparties/counterparty/{id}', 'get', metadata);
  }

  /**
   * Updates an existing counterparty with partial data. Note: You cannot change the type
   * (individual <-> business).
   *
   * @summary Update a Counterparty
   */
  updateCounterparty(body: types.UpdateCounterpartyBodyParam, metadata: types.UpdateCounterpartyMetadataParam): Promise<FetchResponse<200, types.UpdateCounterpartyResponse200>> {
    return this.core.fetch('/api/counterparties/counterparty/{id}', 'put', body, metadata);
  }

  /**
   * Returns bank selection requirements for specified payout method types (rails). If the
   * payment method type requires a specific bank, you'll be required to provide a bankId.
   *
   * @summary Get Bank Requirements for Payout Method Types
   */
  getBanksForPayoutMethods(metadata: types.GetBanksForPayoutMethodsMetadataParam): Promise<FetchResponse<200, types.GetBanksForPayoutMethodsResponse200>> {
    return this.core.fetch('/api/counterparties/payment-methods/supported-banks', 'get', metadata);
  }

  /**
   * Search and retrieve counterparties for the organization.
   *
   * @summary Search Counterparties
   */
  searchCounterparties(metadata?: types.SearchCounterpartiesMetadataParam): Promise<FetchResponse<200, types.SearchCounterpartiesResponse200>> {
    return this.core.fetch('/api/counterparties/search', 'post', metadata);
  }

  /**
   * Creates a new payout method for a counterparty. This stores the payment details (bank
   * account, blockchain address, etc.) that can be referenced when creating a payout within
   * a payout requests.
   *
   * @summary Create a Payout Method
   */
  createPayoutMethod(body: types.CreatePayoutMethodBodyParam, metadata: types.CreatePayoutMethodMetadataParam): Promise<FetchResponse<201, types.CreatePayoutMethodResponse201>> {
    return this.core.fetch('/api/counterparties/{id}/payout-methods', 'post', body, metadata);
  }

  /**
   * Search and retrieve payout methods for a specific counterparty.
   *
   * @summary Search Payout Methods
   */
  searchPayoutMethods(metadata: types.SearchPayoutMethodsMetadataParam): Promise<FetchResponse<200, types.SearchPayoutMethodsResponse200>> {
    return this.core.fetch('/api/counterparties/{id}/payout-methods/search', 'post', metadata);
  }

  /**
   * Retrieves a single payout method by ID for a counterparty.
   *
   * @summary Get a Payout Method
   */
  getPayoutMethodById(metadata: types.GetPayoutMethodByIdMetadataParam): Promise<FetchResponse<200, types.GetPayoutMethodByIdResponse200>> {
    return this.core.fetch('/api/counterparties/{id}/payout-methods/{payoutMethodId}', 'get', metadata);
  }

  /**
   * Create an Organization
   *
   */
  createOrganization(body: types.CreateOrganizationBodyParam): Promise<FetchResponse<200, types.CreateOrganizationResponse200>> {
    return this.core.fetch('/api/organizations', 'post', body);
  }

  /**
   * Get all Organizations created in Mural subject to the provided filter.
   *
   * @summary Search Organizations
   */
  getOrganizations(body: types.GetOrganizationsBodyParam, metadata?: types.GetOrganizationsMetadataParam): Promise<FetchResponse<200, types.GetOrganizationsResponse200>> {
    return this.core.fetch('/api/organizations/search', 'post', body, metadata);
  }

  /**
   * Get an Organization by the provided ID.
   *
   * @summary Get an Organization
   */
  getOrganization(metadata: types.GetOrganizationMetadataParam): Promise<FetchResponse<200, types.GetOrganizationResponse200>> {
    return this.core.fetch('/api/organizations/{id}', 'get', metadata);
  }

  /**
   * The page at the returned URL guides users through the Mural KYC process. Existing users
   * can use this to provide additional KYC information needed to perform Mural services.
   *
   * @summary Get a hosted KYC link for an Organization
   */
  getOrganizationKycLink(metadata: types.GetOrganizationKycLinkMetadataParam): Promise<FetchResponse<200, types.GetOrganizationKycLinkResponse200>> {
    return this.core.fetch('/api/organizations/{id}/kyc-link', 'get', metadata);
  }

  /**
   * The page at the returned URL allows users to review and accept the terms of service for
   * the organization.
   *
   * @summary Get a hosted terms of service link for an Organization
   */
  getOrganizationTosLink(metadata: types.GetOrganizationTosLinkMetadataParam): Promise<FetchResponse<200, types.GetOrganizationTosLinkResponse200>> {
    return this.core.fetch('/api/organizations/{id}/tos-link', 'get', metadata);
  }

  /**
   * Retrieve detailed information about a verification including the status of the documents
   * provided
   *
   * @summary Fetches Verification Details
   */
  getVerificationDetails(metadata: types.GetVerificationDetailsMetadataParam): Promise<FetchResponse<200, types.GetVerificationDetailsResponse200>> {
    return this.core.fetch('/api/organizations/{id}/verification', 'get', metadata);
  }

  /**
   * Submit a new organization verification (KYC) for processing
   *
   * @summary Create Organization Verification
   */
  createOrganizationVerification(body: types.CreateOrganizationVerificationBodyParam, metadata: types.CreateOrganizationVerificationMetadataParam): Promise<FetchResponse<200, types.CreateOrganizationVerificationResponse200>> {
    return this.core.fetch('/api/organizations/{id}/verification', 'post', body, metadata);
  }

  /**
   * Gets the exchange rate for a given fiat amount and payin rail.
   *
   * @summary Get exchange rate for payin
   */
  getPayinExchangeRate(body: types.GetPayinExchangeRateBodyParam): Promise<FetchResponse<200, types.GetPayinExchangeRateResponse200>> {
    return this.core.fetch('/api/payins/exchange-rate', 'post', body);
  }

  /**
   * Creates a new Payin.
   *
   * @summary Create a Payin
   */
  createPayin(body: types.CreatePayinBodyParam, metadata?: types.CreatePayinMetadataParam): Promise<FetchResponse<201, types.CreatePayinResponse201>> {
    return this.core.fetch('/api/payins/payin', 'post', body, metadata);
  }

  /**
   * Gets the Payin identified by the provided ID.
   *
   * @summary Get a Payin
   */
  getPayin(metadata: types.GetPayinMetadataParam): Promise<FetchResponse<200, types.GetPayinResponse200>> {
    return this.core.fetch('/api/payins/payin/{id}', 'get', metadata);
  }

  /**
   * Cancels the Payin identified by the provided ID.
   *
   * @summary Cancel a Payin
   */
  cancelPayin(metadata: types.CancelPayinMetadataParam): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/api/payins/payin/{id}/cancel', 'post', metadata);
  }

  /**
   * Get all Payins associated with the provided Organization ID.
   *
   * @summary Search Payins
   */
  searchPayins(metadata?: types.SearchPayinsMetadataParam): Promise<FetchResponse<200, types.SearchPayinsResponse200>> {
    return this.core.fetch('/api/payins/search', 'post', metadata);
  }

  /**
   * Gets the required bank names for a given fiat and rail code. This endpoint should be
   * used to validate the bank name provided in the payout request if you are sending a fiat
   * payout.
   *
   * @summary Get bank details
   */
  getBankDetails(metadata: types.GetBankDetailsMetadataParam): Promise<FetchResponse<200, types.GetBankDetailsResponse200>> {
    return this.core.fetch('/api/payouts/bank-details', 'get', metadata);
  }

  /**
   * Computes the estimated original token amount required and estimated fees for a recipient
   * to receive the provided fiat currency amount.
   *
   * @summary Get fees for fiat amount
   */
  getPayoutFeesForFiatAmount(body: types.GetPayoutFeesForFiatAmountBodyParam): Promise<FetchResponse<200, types.GetPayoutFeesForFiatAmountResponse200>> {
    return this.core.fetch('/api/payouts/fees/fiat-to-token', 'post', body);
  }

  /**
   * Computes the expected fees for a given token amount and payout fiat currency.
   *
   * @summary Get fees for token amount
   */
  getPayoutFeesForTokenAmount(body: types.GetPayoutFeesForTokenAmountBodyParam): Promise<FetchResponse<200, types.GetPayoutFeesForTokenAmountResponse200>> {
    return this.core.fetch('/api/payouts/fees/token-to-fiat', 'post', body);
  }

  /**
   * Creates a Payout Request. The Payout Request can have multiple recipients, each of which
   * can be a fiat or blockchain payout.
   *
   * @summary Create a Payout Request
   */
  createPayoutRequest(body: types.CreatePayoutRequestBodyParam, metadata?: types.CreatePayoutRequestMetadataParam): Promise<FetchResponse<201, types.CreatePayoutRequestResponse201>> {
    return this.core.fetch('/api/payouts/payout', 'post', body, metadata);
  }

  /**
   * Retrieves the Payout Request Body identified by the provided ID. This endpoint should
   * only be used as part of an end-user custodial payout flow.
   *
   * @summary Get a Payout Request Body used to sign the Payout
   */
  getPayoutRequestPayload(metadata: types.GetPayoutRequestPayloadMetadataParam): Promise<FetchResponse<200, types.GetPayoutRequestPayloadResponse200>> {
    return this.core.fetch('/api/payouts/payout/end-user-custodial/body-to-sign/{id}', 'get', metadata);
  }

  /**
   * Cancels a Payout Request.
   *
   * @summary Cancel an end-user custodial Payout Request
   */
  cancelEndUserCustodialPayoutRequest(metadata: types.CancelEndUserCustodialPayoutRequestMetadataParam): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/api/payouts/payout/end-user-custodial/cancel/{id}', 'post', metadata);
  }

  /**
   * Executes a Payout Request using an end-user custodial signature.
   *
   * @summary Execute an end-user custodial Payout Request
   */
  executeEndUserCustodialPayoutRequest(body: types.ExecuteEndUserCustodialPayoutRequestBodyParam, metadata: types.ExecuteEndUserCustodialPayoutRequestMetadataParam): Promise<FetchResponse<200, types.ExecuteEndUserCustodialPayoutRequestResponse200>> {
    return this.core.fetch('/api/payouts/payout/end-user-custodial/execute/{id}', 'post', body, metadata);
  }

  /**
   * Gets the Payout Request identified by the provided ID.
   *
   * @summary Get a Payout Request
   */
  getPayoutRequest(metadata: types.GetPayoutRequestMetadataParam): Promise<FetchResponse<200, types.GetPayoutRequestResponse200>> {
    return this.core.fetch('/api/payouts/payout/{id}', 'get', metadata);
  }

  /**
   * Cancel a Payout Request
   *
   */
  cancelPayoutRequest(metadata: types.CancelPayoutRequestMetadataParam): Promise<FetchResponse<200, types.CancelPayoutRequestResponse200>> {
    return this.core.fetch('/api/payouts/payout/{id}/cancel', 'post', metadata);
  }

  /**
   * Execute a Payout Request
   *
   */
  executePayoutRequest(body: types.ExecutePayoutRequestBodyParam, metadata: types.ExecutePayoutRequestMetadataParam): Promise<FetchResponse<200, types.ExecutePayoutRequestResponse200>> {
    return this.core.fetch('/api/payouts/payout/{id}/execute', 'post', body, metadata);
  }

  /**
   * Get all Payout Requests associated with the provided Organization ID and filtered by the
   * provided statuses.
   *
   * @summary Search Payout Requests
   */
  searchPayoutRequests(body: types.SearchPayoutRequestsBodyParam, metadata?: types.SearchPayoutRequestsMetadataParam): Promise<FetchResponse<200, types.SearchPayoutRequestsResponse200>> {
    return this.core.fetch('/api/payouts/search', 'post', body, metadata);
  }

  /**
   * Search for Transactions associated with the provided Account ID
   *
   * @summary Search Transactions
   */
  searchTransactionsForAccount(metadata: types.SearchTransactionsForAccountMetadataParam): Promise<FetchResponse<200, types.SearchTransactionsForAccountResponse200>> {
    return this.core.fetch('/api/transactions/search/account/{accountId}', 'post', metadata);
  }

  /**
   * Gets the Transaction identified by the provided ID.
   *
   * @summary Get a Transaction
   */
  getTransaction(metadata: types.GetTransactionMetadataParam): Promise<FetchResponse<200, types.GetTransactionResponse200>> {
    return this.core.fetch('/api/transactions/{id}', 'get', metadata);
  }

  /**
   * Returns valid country and subdivision codes for a specific fiat rail code.
   *
   * @summary Get supported countries and subdivisions for a fiat rail code
   */
  getCountriesSupportedForFiatRail(metadata: types.GetCountriesSupportedForFiatRailMetadataParam): Promise<FetchResponse<200, types.GetCountriesSupportedForFiatRailResponse200>> {
    return this.core.fetch('/api/utilities/countries/{fiatRailCode}', 'get', metadata);
  }

  /**
   * Lists all webhooks for the authenticated organization
   *
   * @summary List webhooks
   */
  listWebhooks(): Promise<FetchResponse<200, types.ListWebhooksResponse200>> {
    return this.core.fetch('/api/webhooks', 'get');
  }

  /**
   * Creates a new webhook endpoint in DISABLED state. Limited to 5 webhooks per
   * organization.
   *
   * @summary Create webhook
   */
  createWebhook(body: types.CreateWebhookBodyParam): Promise<FetchResponse<201, types.CreateWebhookResponse201>> {
    return this.core.fetch('/api/webhooks', 'post', body);
  }

  /**
   * Deletes a webhook. Webhook will stop receiving events but delivery history is preserved.
   *
   * @summary Delete webhook
   */
  deleteWebhook(metadata: types.DeleteWebhookMetadataParam): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/api/webhooks/{webhookId}', 'delete', metadata);
  }

  /**
   * Retrieves a specific webhook by ID
   *
   * @summary Get webhook
   */
  getWebhook(metadata: types.GetWebhookMetadataParam): Promise<FetchResponse<200, types.GetWebhookResponse200>> {
    return this.core.fetch('/api/webhooks/{webhookId}', 'get', metadata);
  }

  /**
   * Partially updates webhook configuration. Only provided fields will be updated. Use the
   * separate status endpoint to activate/deactivate webhooks.
   *
   * @summary Update webhook
   */
  updateWebhook(body: types.UpdateWebhookBodyParam, metadata: types.UpdateWebhookMetadataParam): Promise<FetchResponse<200, types.UpdateWebhookResponse200>> {
    return this.core.fetch('/api/webhooks/{webhookId}', 'patch', body, metadata);
  }

  /**
   * Triggers a test webhook event for the specified webhook and category
   *
   * @summary Send webhook event
   */
  sendWebhookEvent(body: types.SendWebhookEventBodyParam, metadata: types.SendWebhookEventMetadataParam): Promise<FetchResponse<200, types.SendWebhookEventResponse200>> {
    return this.core.fetch('/api/webhooks/{webhookId}/send', 'post', body, metadata);
  }

  /**
   * Updates the status of a webhook (ACTIVE/DISABLED). This operation is idempotent - if the
   * status is already the requested value, no changes are made.
   *
   * @summary Update webhook status
   */
  updateWebhookStatus(body: types.UpdateWebhookStatusBodyParam, metadata: types.UpdateWebhookStatusMetadataParam): Promise<FetchResponse<200, types.UpdateWebhookStatusResponse200>> {
    return this.core.fetch('/api/webhooks/{webhookId}/status', 'patch', body, metadata);
  }
}

const createSDK = (() => { return new SDK(); })()
;

export default createSDK;

export type { CancelEndUserCustodialPayoutRequestMetadataParam, CancelPayinMetadataParam, CancelPayoutRequestMetadataParam, CancelPayoutRequestResponse200, CreateAccountBodyParam, CreateAccountMetadataParam, CreateAccountResponse200, CreateCounterpartyBodyParam, CreateCounterpartyMetadataParam, CreateCounterpartyResponse201, CreateOrganizationBodyParam, CreateOrganizationResponse200, CreateOrganizationVerificationBodyParam, CreateOrganizationVerificationMetadataParam, CreateOrganizationVerificationResponse200, CreatePayinBodyParam, CreatePayinMetadataParam, CreatePayinResponse201, CreatePayoutMethodBodyParam, CreatePayoutMethodMetadataParam, CreatePayoutMethodResponse201, CreatePayoutRequestBodyParam, CreatePayoutRequestMetadataParam, CreatePayoutRequestResponse201, CreateWebhookBodyParam, CreateWebhookResponse201, DeleteWebhookMetadataParam, ExecuteEndUserCustodialPayoutRequestBodyParam, ExecuteEndUserCustodialPayoutRequestMetadataParam, ExecuteEndUserCustodialPayoutRequestResponse200, ExecutePayoutRequestBodyParam, ExecutePayoutRequestMetadataParam, ExecutePayoutRequestResponse200, GetAccountMetadataParam, GetAccountResponse200, GetAccountsMetadataParam, GetAccountsResponse200, GetBankDetailsMetadataParam, GetBankDetailsResponse200, GetBanksForPayoutMethodsMetadataParam, GetBanksForPayoutMethodsResponse200, GetCounterpartyByIdMetadataParam, GetCounterpartyByIdResponse200, GetCountriesSupportedForFiatRailMetadataParam, GetCountriesSupportedForFiatRailResponse200, GetOrganizationKycLinkMetadataParam, GetOrganizationKycLinkResponse200, GetOrganizationMetadataParam, GetOrganizationResponse200, GetOrganizationTosLinkMetadataParam, GetOrganizationTosLinkResponse200, GetOrganizationsBodyParam, GetOrganizationsMetadataParam, GetOrganizationsResponse200, GetPayinExchangeRateBodyParam, GetPayinExchangeRateResponse200, GetPayinMetadataParam, GetPayinResponse200, GetPayoutFeesForFiatAmountBodyParam, GetPayoutFeesForFiatAmountResponse200, GetPayoutFeesForTokenAmountBodyParam, GetPayoutFeesForTokenAmountResponse200, GetPayoutMethodByIdMetadataParam, GetPayoutMethodByIdResponse200, GetPayoutRequestMetadataParam, GetPayoutRequestPayloadMetadataParam, GetPayoutRequestPayloadResponse200, GetPayoutRequestResponse200, GetTransactionMetadataParam, GetTransactionResponse200, GetVerificationDetailsMetadataParam, GetVerificationDetailsResponse200, GetWebhookMetadataParam, GetWebhookResponse200, InitiateEndUserCustodialChallengeBodyParam, InitiateEndUserCustodialChallengeMetadataParam, InitiateEndUserCustodialChallengeResponse200, ListWebhooksResponse200, SearchCounterpartiesMetadataParam, SearchCounterpartiesResponse200, SearchPayinsMetadataParam, SearchPayinsResponse200, SearchPayoutMethodsMetadataParam, SearchPayoutMethodsResponse200, SearchPayoutRequestsBodyParam, SearchPayoutRequestsMetadataParam, SearchPayoutRequestsResponse200, SearchTransactionsForAccountMetadataParam, SearchTransactionsForAccountResponse200, SendWebhookEventBodyParam, SendWebhookEventMetadataParam, SendWebhookEventResponse200, SetDeveloperFeesBodyParam, SetDeveloperFeesMetadataParam, SetDeveloperFeesResponse200, UpdateCounterpartyBodyParam, UpdateCounterpartyMetadataParam, UpdateCounterpartyResponse200, UpdateWebhookBodyParam, UpdateWebhookMetadataParam, UpdateWebhookResponse200, UpdateWebhookStatusBodyParam, UpdateWebhookStatusMetadataParam, UpdateWebhookStatusResponse200 } from './types';
