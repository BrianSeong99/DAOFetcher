import { useEffect } from 'react'

import ActionableImageCard from "@/components/ActionableImageCard/ActionableImageCard";
import getDAOServerList from "@/abis/getDAOServerList";
import getDAOInfo from "@/abis/getDAOInfo";

const ServerLists = (props) => {
  const {
    serverList,
    setServerList
  } = props;

  useEffect(() => {
    console.log("here");
    async function fetch() {
      const daoServerAddressList = await getDAOServerList();
      let ls = [];
      for (let i = 0; i < daoServerAddressList.length; i++) {
        ls.push(await getDAOInfo(daoServerAddressList[i]));
      }
      console.log(ls);
      setServerList(ls);
    }
    fetch();
  }, []);

  return (
    <div className="grid grid-cols-4 items-center gap-4">
    {serverList.map((e) => (
      <ActionableImageCard
        key={e.daoName}
        name={e.daoName}
        src={e.daoIconURL}
        // description={e.daoId}
        action={e.action}
      />
    ))}
  </div>
  )
}

export default ServerLists;