"use client";

import { config } from "@/config/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { useState, type ReactNode } from "react";
import { WagmiProvider, type State } from "wagmi";

export function Providers(props: {
  children: ReactNode;
  initialState?: State;
}) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <SessionProvider>
      <WagmiProvider config={config} initialState={props.initialState}>
        <QueryClientProvider client={queryClient}>
          {props.children}
        </QueryClientProvider>
      </WagmiProvider>
    </SessionProvider>
  );
}
