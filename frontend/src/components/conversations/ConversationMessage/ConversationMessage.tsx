import { obscureAddress } from "@/utils/StringUtils";
import { ethers } from "ethers";
import Image from "next/image";
import { FC } from "react";

interface ConversationMessageProps {
  message: string;
  actor: string;
}

const ConversationMessage: FC<ConversationMessageProps> = (
  props: ConversationMessageProps
) => {
  return (
    <div className="flex">
      <Image
        src="https://picsum.photos/200"
        width={200}
        height={200}
        alt=""
        className="h-8 w-8 rounded-sm shadow-md"
      />
      <div className="ml-4 mt-1">
        <h1> {props.message}</h1>
      </div>
    </div>
  );
};

export default ConversationMessage;
