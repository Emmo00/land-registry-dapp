"use client";

import { config } from "../../wagmi";
import { WagmiProvider, cookieToInitialState } from "wagmi";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";


const queryClient = new QueryClient();

type Props = {
    children: React.ReactNode;
    cookie?: string | null;
};

export default function Web3Provider({ children, cookie }: Props) {
    const initialState = cookieToInitialState(config, cookie);

    return (
        <WagmiProvider config={config} initialState={initialState}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider
                    theme={darkTheme({
                        accentColor: "#0E76FD",
                        accentColorForeground: "white",
                        borderRadius: "large",
                        fontStack: "system",
                        overlayBlur: "small",
                    })}
                >
                    {children}
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}