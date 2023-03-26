"use client";

import NavigationBar from "@/components/NavigationBar/NavigationBar";
import PolybaseService from "@/services/PolybaseService";
import { Message } from "@/types/conversation.types";
import { capitalizeFirst } from "@/utils/StringUtils";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { NextPage } from "next";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import PulseLoader from "react-spinners/PulseLoader";

import { motion, AnimatePresence } from "framer-motion";

import UilMessage from "@iconscout/react-unicons/icons/uil-message";
import ConversationMessage from "@/components/conversations/ConversationMessage/ConversationMessage";

const ProtocolChat: NextPage = () => {
  const pathname = usePathname();
  const account = useAccount();

  const [messages, setMessages] = useState<Message[]>([]);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (!pathname || !account.address) return;

    const path = pathname.substring(1).toLowerCase();

    const fetchData = async () => {
      try {
        // Get the messages from the server
        const result = (
          await PolybaseService.getMessages(path, account.address!)
        ).data;

        const filteredMessages: Message[] = [];

        // Push the messages to the state
        result.forEach(
          (message) =>
            message.data.protocolId == path &&
            filteredMessages.push({
              actor: message.data.actor,
              message: message.data.message,
              timestamp: message.data.timestamp,
            })
        );

        setMessages(filteredMessages);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account.address, pathname]);

  /**
   * Submit the messages to the server
   *
   * @param e the message
   */
  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();

    const target = e.target as HTMLFormElement;
    const data = new FormData(target);

    if (!pathname || !account.address || !data.get("message") || isSending)
      return;

    const path = pathname.substring(1).toLowerCase();

    setIsSending(true);
    try {
      await PolybaseService.createMessage(
        path,
        account.address!,
        account.address!,
        data.get("message")!.toString()
      );
      setMessages(
        messages.concat({
          actor: account.address,
          message: data.get("message")!.toString(),
          timestamp: Date.now(),
        })
      );
      target.message.value = "";
    } catch (error) {
      console.log(error);
    }
    setIsSending(false);
  };

  const handleClearChat = async (): Promise<void> => {
    if (!pathname || !account.address || isSending || messages.length == 0)
      return;

    const path = pathname.substring(1).toLowerCase();

    setIsSending(true);
    try {
      await PolybaseService.clearMessages(path, account.address!);
      setMessages([]);
    } catch (error) {
      console.log(error);
    }
    setIsSending(false);
  };

  return (
    <div className="center w-full ">
      <div className="max-w-7xl h-screen w-full pt-6 flex flex-col">
        {/** Header */}
        <div className="flex items-end justify-between">
          <h1 className="font-bold text-4xl">
            {capitalizeFirst(pathname!.substring(1))} Chat
          </h1>

          <NavigationBar />
        </div>

        {/** States - Loading, connected, disconnected */}
        <AnimatePresence mode="popLayout">
          <motion.div
            key={
              account.isConnecting
                ? "loading"
                : account.isConnected
                ? "connected"
                : "disconnected"
            }
            animate={{
              y: [100, 0],
              opacity: [0, 1],
            }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="h-full flex flex-1"
          >
            {account.isConnecting ? (
              <div className="flex-1 flex-col h-full center">
                <Image
                  src="https://assets.website-files.com/5d5e2ff58f10c53dcffd8683/5d99f791e288d8a01aa668e2_composition-11.svg"
                  width={512}
                  height={288}
                  alt=""
                  className="rounded-2xl"
                />
                <br />
                <h1 className="text-2xl font-bold">
                  Loading {capitalizeFirst(pathname!.substring(1))} chat...
                </h1>
                <h2 className="text-sm">
                  Please wait while we load your conversation.
                </h2>
              </div>
            ) : account.isConnected ? (
              <div className="flex flex-col flex-1 h-full ">
                <div>
                  <div> Summaries</div>

                  <button onClick={handleClearChat}> Clear chat </button>

                  <div>Chats</div>
                </div>

                <div className="flex flex-col flex-1 overflow-scroll">
                  {messages
                    .sort((a, b) => a.timestamp - b.timestamp)
                    .map((message, i) => (
                      <div
                        key={message.timestamp}
                        className="border-t border-primary/20 py-4"
                      >
                        <ConversationMessage
                          actor={message.actor}
                          message={message.message}
                        />
                      </div>
                    ))}
                </div>

                <div className="relative bottom-10 left-0 right-0 bg-surface/50">
                  <form
                    id="message-form"
                    method="post"
                    onSubmit={handleSubmit}
                    className="flex flex-col justify-center items-center"
                  >
                    <div className="flex w-full bg-primary/20 rounded-full items-center px-6 py-2 ">
                      <input
                        name="message"
                        className="flex-1 bg-transparent ring-transparent outline-none mr-2 text-lg"
                        disabled={isSending}
                      />
                      {!isSending ? (
                        <button
                          form="message-form"
                          type="submit"
                          className="opacity-50 scale-shadow-interactable rounded-full p-1 h-8"
                        >
                          <UilMessage />
                        </button>
                      ) : (
                        <PulseLoader
                          size={8}
                          color="green"
                          className="h-8 center"
                        />
                      )}
                    </div>
                    <p className="opacity-50 mt-2">
                      {isSending
                        ? "Sending message"
                        : "Input a question to ask the server"}
                    </p>
                  </form>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex-col center">
                <Image
                  src="https://assets.website-files.com/5d5e2ff58f10c53dcffd8683/5da4bd9196a90c1ed77a7792_composition-23.svg"
                  width={512}
                  height={288}
                  alt=""
                  className="rounded-2xl"
                />
                <br />
                <h1 className="text-2xl font-bold">
                  Welcome to {capitalizeFirst(pathname!.substring(1))}
                </h1>
                <h2 className="text-sm">
                  Connect with your wallet to continue
                </h2>
                <br />
                <ConnectButton />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProtocolChat;
