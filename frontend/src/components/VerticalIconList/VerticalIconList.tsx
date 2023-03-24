"use client";

import { NextPage } from "next";
import Image from "next/image";

const VerticalIconList: NextPage = () => {
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
      description: "Community owned, Open Source, Web3 wallet",
      action: () => {},
    },
    {
      src: "https://avatars.githubusercontent.com/u/58791460?s=280&v=4",
      name: "Optimism",
      description: "Layer 2 scaling solution for Ethereum",
      action: () => {},
    },
  ];

  return (
    <div className="flex flex-col items-center gap-4">
      {mockServerList.map((e) => (
        <button
          key={e.name}
          className="rounded-full border border-transparent hover:border-white/70 bg-black/20 h-12 aspect-square overflow-clip scale-shadow-interactable "
          onClick={e.action}
        >
          <Image src={e.src} alt={e.name} width={164} height={164} />
        </button>
      ))}
    </div>
  );
};

export default VerticalIconList;
