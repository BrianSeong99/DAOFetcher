"use client";

import Image from "next/image";
import { FC } from "react";

interface ActionableImageCardProps {
  name: string;
  src: string;
  description: string;
  id: string;
  action: () => void;
  handleMintModal: (id) => void;
}

const ActionableImageCard: FC<ActionableImageCardProps> = (props) => {
  return (
    <button
      className="border border-black/10 hover:shadow-lg hover:shadow-black/5 shadow-transparent transition-all w-full aspect-4/5 rounded-lg "
      // onClick={props.action}
    >
      <div className="flex flex-col items-center justify-center gap-4">
        <div>
          <Image
            src={props.src}
            alt={props.name}
            width={75}
            height={75}
            className="rounded-full overflow-clip  shadow-md"
          />
        </div>

        <div className="px-6">
          <h1 className="font-bold text-2xl">{props.name}</h1>
          {/* <h3 className="text-sm opacity-90">{props.description}</h3> */}
        </div>

        <div className="border border-primary text-primary hover:bg-primary/10 px-6 py-2 scale-shadow-interactable rounded-full"
          onClick={() => props.handleMintModal(props.id)}
        >
          Mint Membership
        </div>
      </div>
    </button>
  );
};

export default ActionableImageCard;
