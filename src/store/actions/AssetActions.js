import { ethers } from "ethers";
import { nftaddress, nftmarketaddress } from "../../config";
import NFTMarket from "../../artifacts/contracts/NFTMarketPlace.sol/NFTMarketPlace.json";

function FetchAssets() {
  return async (dispatch, getState) => {
    try {
      const provider = getState().provider.blockchain;
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
      const data = await marketContract.getAllAssets(accounts[0]);
      console.log(data);
      dispatch({ type: "ASSETS", payload: data });
    } catch (err) {
      console.log(err);
      dispatch({ type: "ASSETS", payload: [] });
    }
  };
}

export default { FetchAssets };
export { FetchAssets };
