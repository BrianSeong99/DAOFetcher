"use client";

/* eslint-disable @next/next/no-head-element */
import VerticalIconList from "@/components/VerticalIconList/VerticalIconList";

/** Root imports */
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

import React, { useState, ReactElement } from "react";

/** Root styles */
import "@/styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import "@/styles/interactions.css";

/** Wagmi */
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import {
  polygonMumbai,
  gnosisChiado,
  optimismGoerli,
  scrollTestnet,
} from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { ServerListProvider } from "../src/utils/ServerListContext";
import { useRouter } from "next/navigation";

import { Chain } from 'wagmi/chains';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';

const mantleTest: Chain = {
  id: 5001,
  name: 'MantleTestnet',
  network: 'mantle testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'BIT',
    symbol: 'BIT',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.testnet.mantle.xyz'],
    },
    public: {
        http: ["https://rpc.testnet.mantle.xyz"],
    },
  },
  blockExplorers: {
    default: { name: 'MantleScan', url: 'https://explorer.testnet.mantle.xyz/' },
  },
  testnet: false,
};

const { chains, provider } = configureChains(
  [polygonMumbai, optimismGoerli, gnosisChiado, scrollTestnet, mantleTest],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "DAO Fetcher",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedDAOChat, setSelectedDAOChat] = useState(null);
  const router = useRouter();

  const handleSelectedChange = (id, name) => {
    setSelectedDAOChat(id);
    router.push(`/${name}`);
  };

  return (
    <html className={inter.className}>
      <head></head>
      <body className="h-full">
        <ServerListProvider>
          <WagmiConfig client={wagmiClient}>
            <RainbowKitProvider chains={chains}>
              <div className="flex ">
                <nav className="w-20 flex flex-col bg-on-surface h-screen pt-6">
                  <VerticalIconList
                    selectedDAOChat={selectedDAOChat}
                    handleSelectedChange={handleSelectedChange}
                  />
                </nav>
                {children}
              </div>
            </RainbowKitProvider>
          </WagmiConfig>
        </ServerListProvider>
      </body>
    </html>
  );
}
