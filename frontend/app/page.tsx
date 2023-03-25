"use client";

import React, { useState, useEffect } from 'react'
import getDAOServerList from "@/abis/getDAOServerList";
/** Root styles */
import "@/styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import "@/styles/interactions.css";


import ActionableImageCard from "@/components/ActionableImageCard/ActionableImageCard";
import NavigationBar from "@/components/NavigationBar/NavigationBar";
import CreateFetcher from '@/components/CreateFetcher/CreateFetcher.js';
import Image from "next/image";

export default function Home() {
  const [code, setCode] = useState("")
  const mockServerList = [
    {
      src: "https://cdn.stamp.fyi/space/aave.eth?s=164",
      name: "Aave",
      description:
        "Non-custodial protocol to earn interest on deposits and borrow assets.",
      action: () => {},
    },
    {
      src: "https://avatars.githubusercontent.com/u/77035304?s=280&v=4",
      name: "Taho",
      description: "Community owned, Open Source, Web3 wallet.",
      action: () => {},
    },
    {
      src: "https://avatars.githubusercontent.com/u/58791460?s=280&v=4",
      name: "Optimism",
      description: "Layer 2 scaling solution for Ethereum.",
      action: () => {},
    },
  ];
  const [showModal, setShowModal] = useState(false);
  const handleModal = () => {
    setShowModal(true)
  };
  useEffect(() => {
    // Get the authorization code from the URL query parameters
    const searchParams = new URLSearchParams(window.location.search);
    const retrieved = searchParams.get('code');
    console.log("retrieved code", searchParams, retrieved)
    if (retrieved !== null) {
      setCode(retrieved)
    }
    // Use the authorization code to exchange it for an access token
    // ...
  }, []);

  useEffect(() => {
    console.log("here");
    async function fetch() {
      await getDAOServerList();
    }
    fetch();
  }, []);

  return (
    <div className="flex flex-col items-center w-full">
      <section className="max-w-7xl py-6 w-full ">
        <div className="flex items-end justify-between">
          <h1 className="font-bold text-4xl">Servers</h1>

          <NavigationBar
            handleModal={handleModal}
            showModal={showModal}
          />
        </div>

        <br />
        {showModal &&
          <CreateFetcher
            onClose={() => setShowModal(false)}
            code={code}
          // show={showModal}
          />
        }
        <div className="grid grid-cols-4 items-center gap-4">
          {mockServerList.map((e) => (
            <ActionableImageCard
              key={e.name}
              name={e.name}
              src={e.src}
              description={e.description}
              action={e.action}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
