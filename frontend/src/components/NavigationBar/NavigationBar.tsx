"use client";

import { NextPage } from "next";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import UilSetting from "@iconscout/react-unicons/icons/uil-setting";
import Uilbell from "@iconscout/react-unicons/icons/uil-bell";

const NavigationBar: NextPage = (props) => {
  const {
    handleRegisterModal,
    showRegisterModal
  } = props
  return (
    <div className="flex items-center gap-4">
      <ConnectButton />

      <button className="bg-primary text-white px-6 py-2 scale-shadow-interactable rounded-full"
        onClick={handleRegisterModal}
      >
        Register Server
      </button>

      <button className="p-2 border rounded-full scale-shadow-interactable ">
        <Uilbell />
      </button>

      <button className="p-2 border rounded-full scale-shadow-interactable ">
        <UilSetting />
      </button>
    </div>
  );
};

export default NavigationBar;
