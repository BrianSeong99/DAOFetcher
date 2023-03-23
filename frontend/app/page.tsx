"use client";

import ActionableImageCard from "@/components/ActionableImageCard/ActionableImageCard";
import NavigationBar from "@/components/NavigationBar/NavigationBar";

export default function Home() {
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

  return (
    <div className="flex flex-col items-center w-full">
      <section className="max-w-7xl py-6 w-full ">
        <div className="flex items-end justify-between">
          <h1 className="font-bold text-4xl">Servers</h1>

          <NavigationBar />
        </div>

        <br />

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
