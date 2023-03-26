import { getSigner, getNetwork } from "../utils/getSigner";
import DAOServerABI from "./abis/DAOServer.json";
import { ethers } from "ethers";

export default async function mintMembership(DAOServerAddress, _type, _price) {
  const signer = await getSigner();
  const userAddress = await signer.getAddress();;
  console.log(DAOServerAddress);
  if (signer) {
    const daoServer = new ethers.Contract(
      DAOServerAddress,
      DAOServerABI.abi,
      signer
    );
    console.log(daoServer);
    const tx = await daoServer.mintNoneAdminMembership(userAddress, _type, {
      value: _price,
    });
    const response = await tx.wait();
    return response
  } else {
    console.log("No Wallet Connected");
  }
}