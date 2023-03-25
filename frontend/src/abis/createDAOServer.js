import { getSigner, getNetwork } from "../utils/getSigner";
import DAOServerFactoryABI from "./abis/DAOServerFactory.json";
import { DAOServerFactoryAddress } from "../constants/ContractAddress";
import { ethers } from "ethers";

export default async function createDAOServer(
  daoName, daoIcon, daoId,
  names, symbols, tokenURIs, durations, prices,
) {
  const signer = await getSigner();
  if (signer) {
    const factory = new ethers.Contract(
      DAOServerFactoryAddress[(await getNetwork()).chainId.toString()],
      DAOServerFactoryABI.abi,
      signer
    );
    const tx = await factory.createDAOServer(
      daoName, daoIcon, daoId,
      names, symbols, tokenURIs, durations, prices.map((price) =>
        ethers.utils.parseEther(price.toString())
      )
    );
    const response = await tx.wait();
    return response
  } else {
    console.log("No Wallet Connected");
  }
}
