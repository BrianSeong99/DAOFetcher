import { useEffect } from 'react'

import ActionableImageCard from "@/components/ActionableImageCard/ActionableImageCard";
import getDAOServerList from "@/abis/getDAOServerList";
import getDAOInfo from "@/abis/getDAOInfo";
import { useServerList } from '../../utils/ServerListContext';

const ServerLists = (props) => {
  const { showRegisterModal } = props;

  const { serverList, handleServerListChange } = useServerList();

  async function fetch() {
    const daoServerAddressList = await getDAOServerList();
    let serverList_tmp = [];
    for (let i = 0; i < daoServerAddressList.length; i++) {
      serverList_tmp.push(await getDAOInfo(daoServerAddressList[i]));
      handleServerListChange([...serverList_tmp]);
    }
  }
  
  useEffect(() => {
    fetch();
  }, []);

  useEffect(() => {
    fetch();
  }, [showRegisterModal]);

  return (
    <div className="grid grid-cols-4 items-center gap-4">
    {Array.isArray(serverList) && serverList.length != 0 && serverList.map((e) => (
      <ActionableImageCard
        key={e.daoName}
        name={e.daoName}
        src={e.daoIconURL}
        id={e.daoId}
        isMember={e.isUserMember}
        action={e.action}
        handleMintModal={props.handleMintModal}
      />
    ))}
  </div>
  )
}

export default ServerLists;