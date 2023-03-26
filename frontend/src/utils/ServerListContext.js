// Create a new file named ServerListContext.js
import getDAOInfo from "@/abis/getDAOInfo";
import getDAOServerList from "@/abis/getDAOServerList";
import { createContext, useContext, useEffect, useState } from "react";
import { useAccount } from "wagmi";

const ServerListContext = createContext();

export const useServerList = () => {
  return useContext(ServerListContext);
};

export const ServerListProvider = ({ children }) => {
  const [serverList, setServerList] = useState([]);

  const account = useAccount();

  const handleServerListChange = (ls) => {
    setServerList(ls);
  };

  async function fetch() {
    const daoServerAddressList = await getDAOServerList();
    let ls = [];
    for (let i = 0; i < daoServerAddressList.length; i++) {
      ls.push(await getDAOInfo(daoServerAddressList[i]));
    }
    handleServerListChange(ls);
  }

  useEffect(() => {
    fetch();
  }, [account.status]);

  return (
    <ServerListContext.Provider value={{ serverList, handleServerListChange }}>
      {children}
    </ServerListContext.Provider>
  );
};
