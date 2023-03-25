import getWeb3 from "../utils/getSigner";
import DAOServerFactoryABI from "./abis/DAOServerFactory.json";

const DAOServerFactoryAddress = "0x..."; 

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
