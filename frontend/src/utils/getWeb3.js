export default async function getWeb3(provider) {
  if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
    return provider;
  } else {
    console.error("Ethereum provider not detected");
    return null;
  }
}
