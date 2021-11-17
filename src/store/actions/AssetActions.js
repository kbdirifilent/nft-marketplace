import { ethers } from "ethers";
import { nftaddress, nftmarketaddress } from "../../config";
import NFTMarket from "../../artifacts/contracts/NFTMarketPlace.sol/NFTMarketPlace.json";

function FetchAssets() {
  return async (dispatch, getState) => {
    const provider = getState().provider;
    console.log(provider);
    if (!provider) {
      return;
    }
    const signer = provider.getSigner();
    const accounts = await provider.listAccounts();
    const marketContract = new ethers.Contract(
      nftmarketaddress,
      NFTMarket.abi,
      signer
    );
    console.log(marketContract);
    const data = await marketContract.getAllAssets(accounts[0]);
    console.log(data);
    dispatch({ type: "ASSETS", payload: ["a"] });
  };
}

export default { FetchAssets };
export { FetchAssets };
