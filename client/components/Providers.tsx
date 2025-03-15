
"use client";

import React from "react";
import { WagmiProvider } from "wagmi";
import { config } from "@/utils/wagmiConfig";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
            <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
            {children}
            <Toaster />
            </ThemeProvider>
        </QueryClientProvider>
        </WagmiProvider>
    );
}