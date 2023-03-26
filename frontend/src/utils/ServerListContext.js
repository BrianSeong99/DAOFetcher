// Create a new file named ServerListContext.js
import { createContext, useContext, useState } from 'react';

const ServerListContext = createContext();

export const useServerList = () => {
  return useContext(ServerListContext);
};

export const ServerListProvider = ({ children }) => {
  const [serverList, setServerList] = useState([]);

  const handleServerListChange = (ls) => {
    setServerList(ls);
  };

  return (
    <ServerListContext.Provider value={{ serverList, handleServerListChange }}>
      {children}
    </ServerListContext.Provider>
  );
};
