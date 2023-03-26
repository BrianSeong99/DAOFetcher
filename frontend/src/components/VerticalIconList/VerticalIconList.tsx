"use client";

import { NextPage } from "next";
import Image from "next/image";
import { useServerList } from "../../utils/ServerListContext";

interface VerticalIconListProps {
  selectedDAOChat: any;
  handleSelectedChange: (value: any, name: string) => void;
}

const VerticalIconList: NextPage<VerticalIconListProps> = ({
  selectedDAOChat,
  handleSelectedChange,
}) => {
  const { serverList, handleServerListChange } = useServerList();

  return (
    <div className="flex flex-col items-center gap-4">
      {serverList.map(
        (e) =>
          e.isUserMember && (
            <button
              key={e.daoName}
              className={
                selectedDAOChat === e.daoId
                  ? "rounded-full border border-4 border-solid border-green-500 hover:border-white/70 bg-black/20 h-12 aspect-square overflow-clip scale-shadow-interactable "
                  : "rounded-full border border-transparent hover:border-white/70 bg-black/20 h-12 aspect-square overflow-clip scale-shadow-interactable "
              }
              onClick={() => handleSelectedChange(e.daoId, e.daoName)}
            >
              <Image
                src={e.daoIconURL}
                alt={e.daoName}
                width={164}
                height={164}
              />
            </button>
          )
      )}
    </div>
  );
};

export default VerticalIconList;
