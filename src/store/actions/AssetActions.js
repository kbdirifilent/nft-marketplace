import { ethers } from "ethers";
import { nftaddress, nftmarketaddress } from "../../config";
import NFTMarket from "../../artifacts/contracts/NFTMarketPlace.sol/NFTMarketPlace.json";
import NFT from "../../artifacts/contracts/NFT.sol/NFT.json";
import axios from "axios";

function toNFTItem(item) {
  return {
    itemId: item.itemId.toString(),
    tokenId: item.tokenId.toString(),
    itemAddress: item.itemAddress,
    owner: item.owner,
    price: item.price.toString(),
    listing: item.listing,
  };
}

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
      let data = await marketContract.getAllAssets(accounts[0]);
      const tokenContract = new ethers.Contract(nftaddress, NFT.abi, signer);

      data = data.map((asset) => toNFTItem(asset));
      for (let i = 0; i < data.length; i++) {
        const metadata = await tokenContract.tokenURI(data[i].tokenId);
        const image = await axios.get(metadata).then((res) => res.data.image);
        data[i].image = image;
      }

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
