"use client";

import React, { useState, useEffect } from 'react'
/** Root styles */
import "@/styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import "@/styles/interactions.css";

import NavigationBar from "@/components/NavigationBar/NavigationBar";
import CreateFetcher from '@/components/CreateFetcher/CreateFetcher.js';
import ServerLists from '@/components/ServerLists/ServerLists.js';
import MintMembership from '@/components/MintMembership/MintMembership.js';
import Image from "next/image";

export default function Home() {
  const [code, setCode] = useState("")
  const [discordConnected, setDiscordConnected] = useState(false);

  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showMintModal, setShowMintModal] = useState(false);

  const [mintServerChoice, setMintServerChoice] = useState(null);

  const handleRegisterModal = () => {
    setShowRegisterModal(true)
  };
  const handleMintModal = (id) => {
    console.log("clicked mint", id);
    setMintServerChoice(id);
    setShowMintModal(true)
  };
  
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    let retrieved = searchParams.get('code');
    if (retrieved !== null) {
      setCode(retrieved)
      setDiscordConnected(true);
    }
    retrieved = searchParams.get('show');
    console.log("retrieved code", searchParams, retrieved);
    if (retrieved !== null) {
      setShowRegisterModal(true);
    }
  }, []);

  return (
    <div className="flex flex-col items-center w-full">
      <section className="max-w-7xl py-6 w-full ">
        <div className="flex items-end justify-between">
          <h1 className="font-bold text-4xl">Servers</h1>

          <NavigationBar
            handleRegisterModal={handleRegisterModal}
            showRegisterModal={showRegisterModal}
          />
        </div>

        <br />
        {showRegisterModal &&
          <CreateFetcher
            onClose={() => {setShowRegisterModal(false)}}
            code={code}
            discordConnected={discordConnected}
          // show={showModal}
          />
        }
        <ServerLists
          handleMintModal={handleMintModal}
          showRegisterModal={showRegisterModal}
        />
        {showMintModal &&
          <MintMembership
            onClose={() => setShowMintModal(false)}
            mintServerChoice={mintServerChoice}
          />
        }
      </section >
    </div >
  );
}
