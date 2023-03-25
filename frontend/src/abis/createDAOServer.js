import getWeb3 from "../utils/getWeb3";
import DAOServerFactoryABI from "./abis/DAOServerFactory.json";
import { DAOServerFactoryAddress } from "../constants/ContractAddress";
import { ethers } from "ethers";

export default async function createDAOServer(
  daoName, daoIcon, daoId,
  names, symbols, tokenURIs, durations, prices,
  provider
) {
  const web3 = await getWeb3(provider);
  if (web3) {
    const signer = await web3.getSigner();
    const factory = new ethers.Contract(
      DAOServerFactoryAddress[(await web3.getNetwork()).chainId.toString()],
      DAOServerFactoryABI.abi,
      signer
    );
    const tx = await factory.createDAOServer(
      daoName, daoIcon, daoId,
      names, symbols, tokenURIs, durations, prices
    );
    const response = await tx.wait();
    console.log("DAO Server created");
    return response
  }
}
