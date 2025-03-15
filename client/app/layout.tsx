// layout.tsx
import "./globals.css";
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import { Providers } from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CarbonChain | Web3 Carbon Trading Platform",
  description: "A blockchain-based platform for industries to trade carbon tokens and track emissions",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
