import { MURAL_PAY_CONFIG } from "@/config/mural-pay";
import muralPayClient from "@api/mural-production";

// This does not seem to work. To use a URL besides the default I had to manually edit the openapi.json file
// muralPayClient.server(MURAL_PAY_CONFIG.baseUrl);

muralPayClient.auth(MURAL_PAY_CONFIG.apiKey);

export default muralPayClient;
