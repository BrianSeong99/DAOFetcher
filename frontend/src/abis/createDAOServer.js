import { useState } from "react";
import getWeb3 from "../utils/getWeb3";
import DAOServerFactoryABI from "./abis/DAOServerFactory.json";
import { DAOServerFactoryAddress } from "../constants/ContractAddress";

export async function createDAOServer() {
  const web3 = await getWeb3();
  if (web3) {
    console.log(web3);
    const signer = await web3.getSigner();
    const factory = new ethers.Contract(
      DAOServerFactoryAddress,
      DAOServerFactoryABI,
      signer
    );
    const tx = await factory.createDAOServer(
      daoName,
      // ... other form inputs
    );
    await tx.wait();
    console.log("DAO Server created");
  }
}
