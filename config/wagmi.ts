// config/wagmi.ts
import { cookieStorage, createConfig, createStorage, http } from "wagmi";
import { polygon, polygonAmoy } from "wagmi/chains";

export const config = createConfig({
  chains: [polygon, polygonAmoy], // Support Mainnet and Testnet
  ssr: true, // Essential for Next.js
  storage: createStorage({
    storage: cookieStorage,
  }),
  transports: {
    [polygon.id]: http(),
    [polygonAmoy.id]: http(),
  },
});
