import getWeb3 from "../utils/getWeb3";
import DAOServerFactoryABI from "./abis/DAOServerFactory.json"; // Replace with your contract ABI

const DAOServerFactoryAddress = "0x..."; // Replace with your contract address

export default async function getDAOServerList() {
  const web3 = await getWeb3();
  if (web3) {
    const factory = new ethers.Contract(
      DAOServerFactoryAddress,
      DAOServerFactoryABI,
      web3
    );
    const daoServers = await factory.getAllDAOServers();
    console.log(daoServers);
  }
}
