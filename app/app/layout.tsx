import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import Web3Provider from "@/components/providers/Web3Provider";
import "./globals.css";
import '@rainbow-me/rainbowkit/styles.css';
import { ConnectButton } from "@rainbow-me/rainbowkit";
import HoveringWalletButton from "@/components/buttons/HoveringWalletButton";

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Land Verification - Blockchain-Based Ownership Verification",
  description: "Secure, transparent land ownership verification powered by blockchain technology",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Web3Provider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <HoveringWalletButton />
            {children}
          </ThemeProvider>
        </Web3Provider>
      </body>
    </html>
  )
}
