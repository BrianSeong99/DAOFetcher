import NavigationBar from "@/components/NavigationBar/NavigationBar";
import { NextPage } from "next";
// import UilEnvelopeSend from "@iconscout/react-unicons/icons/uil-sub";

const ProtocolChat: NextPage = () => {
  return (
    <div className="flex flex-col items-center w-full">
      <section className="max-w-7xl h-full py-6 w-full flex flex-col">
        <div className="flex items-end justify-between">
          <h1 className="font-bold text-4xl">Chat</h1>

          <NavigationBar />
        </div>

        <div className="flex-1">
          <div> Summaries</div>

          <div> Chats</div>
        </div>

        <div className="flex flex-col justify-center items-center">
          <input className="w-full bg-primary/50 rounded-full h-10" />
          <p className="opacity-50 mt-2">Input a question to ask the server </p>
          {/* <UilEnvelopeSend /> */}
        </div>
      </section>
    </div>
  );
};

export default ProtocolChat;
