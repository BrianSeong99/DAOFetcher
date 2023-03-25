import * as wagmi from 'wagmi';

export default async function getWeb3() {
  if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
    const provider = wagmi.useProvider();
    return provider;
  } else {
    console.error("Ethereum provider not detected");
    return null;
  }
}
