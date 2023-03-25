import { ethers } from "ethers";

export async function getSigner() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });

      const signer = provider.getSigner();
      return signer;
    } catch (error) {
      console.error("User denied account access:", error);
    }
  } else {
    console.error("Ethereum provider not detected");
  }
}

export async function getNetwork() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    return await provider.getNetwork();
  } else {
    console.error("Ethereum provider not detected");
  }
}
