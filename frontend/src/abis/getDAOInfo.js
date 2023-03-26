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
    console.log("userAddress:", userAddress);
    const daoName = await daoServer.daoName();
    const daoIconURL = await daoServer.daoIconURL();
    const daoId = await daoServer.daoId();
    const isUserMember = await daoServer.isUserMember(userAddress);
    const tokenExpiryTimestamp = await daoServer.tokenExpiryTimestamp(
      await daoServer.userMembershipTokenId(userAddress)
    );
    return {
      daoName: daoName,
      daoIconURL: daoIconURL,
      daoId: daoId,
      isUserMember: isUserMember,
      tokenExpiryTimestamp: tokenExpiryTimestamp,
      DAOServerAddress: DAOServerAddress
    }
  } else {
    console.log("No Wallet Connected");
  }
}