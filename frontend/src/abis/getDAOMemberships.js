import { getSigner, getNetwork } from "../utils/getSigner";
import DAOServerABI from "./abis/DAOServer.json";
import { ethers } from "ethers";

export default async function getDAOMemberships(DAOServerAddress) {
  const signer = await getSigner();
  console.log(DAOServerAddress);
  if (signer) {
    const daoServer = new ethers.Contract(
      DAOServerAddress,
      DAOServerABI.abi,
      signer
    );
    console.log(daoServer);
    const allMembershipTypes = await daoServer.getAllMembershipTypes();
    console.log("allMembershipTypes", allMembershipTypes);
    return allMembershipTypes;
  } else {
    console.log("No Wallet Connected");
  }
}