import { getSigner, getNetwork } from "../utils/getSigner";
import DAOServerFactoryABI from "./abis/DAOServerFactory.json";
import { DAOServerFactoryAddress } from "../constants/ContractAddress";
import { ethers } from "ethers";

export default async function getUserDAORelations() {
  const signer = await getSigner();
  if (signer) {
    const factory = new ethers.Contract(
      DAOServerFactoryAddress[(await getNetwork()).chainId.toString()],
      DAOServerFactoryABI.abi,
      signer
    );
    const userRelations = await factory.getUserDAOServerRelations(await signer.getAddress());
    console.log("userRelations: ", userRelations);
    return userRelations
  } else {
    console.log("No Wallet Connected");
  }
}