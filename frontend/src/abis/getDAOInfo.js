import { getSigner, getNetwork } from "../utils/getSigner";
import DAOServerABI from "./abis/DAOServer.json";
import { ethers } from "ethers";

export default async function getDAOInfo(DAOServerAddress) {
  const signer = await getSigner();
  const userAddress = await signer.getAddress();;
  if (signer) {
    const daoServer = new ethers.Contract(
      DAOServerAddress,
      DAOServerABI.abi,
      signer
    );
    const daoName = await daoServer.daoName();
    const daoIconURL = await daoServer.daoIconURL();
    const daoId = await daoServer.daoId();
    const isUserMember = await daoServer.isUserMember(userAddress);
    return {
      daoName: daoName,
      daoIconURL: daoIconURL,
      daoId: daoId,
      isUserMember: isUserMember
    }
  } else {
    console.log("No Wallet Connected");
  }
}