import { nftaddress, nftmarketaddress } from "../../config";
import { ethers } from "ethers";
import NFT from "../../artifacts/contracts/NFT.sol/NFT.json";
import NFTMarket from "../../artifacts/contracts/NFTMarketPlace.sol/NFTMarketPlace.json";

function ProviderReducer(state = { loading: false, blockchain: null }, action) {
  switch (action.type) {
    case "PROVIDER_LOADING":
      return { ...state, loading: true };
    case "PROVIDER":
      try {
        const signer = action.payload.getSigner();
        const nftContract = new ethers.Contract(nftaddress, NFT.abi, signer);
        const nftMarketContract = new ethers.Contract(
          nftmarketaddress,
          NFTMarket.abi,
          signer
        );
        return {
          ...state,
          loading: false,
          blockchain: {
            provider: action.payload,
            signer,
            nftContract,
            nftMarketContract,
          },
        };
      } catch (e) {
        return { ...state, loading: false, blockchain: null };
      }

    default:
      return state;
  }
}

export default ProviderReducer;
