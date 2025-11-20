import { cookieStorage, createConfig, createStorage, http } from "wagmi";
import { polygon, polygonAmoy } from "wagmi/chains";

export const config = createConfig({
  chains: [polygon, polygonAmoy],
  ssr: true,
  storage: createStorage({ storage: cookieStorage }),
  transports: {
    [polygon.id]: http(),
    [polygonAmoy.id]: http(),
  },
});
