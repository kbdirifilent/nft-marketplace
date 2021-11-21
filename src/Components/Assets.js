import React, { useEffect } from "react";
import { ethers } from "ethers";
import action from "../store/actions/MainActions";
import { useDispatch, useSelector } from "react-redux";
import NFTMarket from "../artifacts/contracts/NFTMarketPlace.sol/NFTMarketPlace.json";
import { nftaddress, nftmarketaddress } from "../config";
import toast from "react-hot-toast";

function Assets() {
  const dispatch = useDispatch();
  const provider = useSelector((state) => state.provider.blockchain);
  const assets = useSelector((state) => state.assets);

  useEffect(() => {
    if (provider !== null) {
      dispatch({ type: "ASSETS_LOADING", payload: null });
      const fetchAssetPromise = dispatch(action.asset.FetchAssets());
      toast.promise(fetchAssetPromise, {
        loading: "fetching assets...",
        success: "Done",
        error: "Error fetching",
      });
    }
  }, [provider]);

  const unlist = async (itemId) => {
    const tx = await provider.nftMarketContract.unlist(itemId);
    await tx.wait();
    window.location.reload();
  };

  return (
    <div>
      <h1 className="px-20 py-10 text-3xl">Assets</h1>
      {assets.assets.length === 0 && assets.loading && (
        <p className="px-10">Loading</p>
      )}
      {assets.assets.length === 0 && !assets.loading && (
        <p className="px-10">No Assets</p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
        {assets.assets.length !== 0 &&
          assets.assets.map((asset, i) => {
            return (
              <div
                key={i}
                className="border shadow rounded-xl overflow-hidden ml-2 mr-2"
                style={{ paddingBottom: "5%" }}
              >
                <img
                  src={asset.image}
                  alt="nft"
                  className="rounded"
                  style={{ height: "50%", width: "100%" }}
                />
                <div className="p-4 bg-pink-500" style={{ height: "100%" }}>
                  <p style={{ opacity: 0.3 }}>
                    tokenId: {asset.tokenId} itemId: {asset.itemId}
                  </p>
                  <h2 className="text-2xl text-white mb-2 mt-1">
                    Name: {asset.name}
                  </h2>
                  <p className="text-white">Description: {asset.description}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                    <p className="text-1xl font-bold text-white">
                      Price : {(asset.price / 1e18).toString()} MATIC
                    </p>
                    <p className="text-1xl font-bold text-white">
                      {asset.listing && "Status: Listing"}

                      {!asset.listing && "Status: Not Listing"}
                    </p>
                  </div>
                  <div>
                    {asset.listing && (
                      <button
                        className="font-bold mt-4 bg-blue-300 text-white rounded shadow-lg"
                        style={{ width: "100px", height: "40px" }}
                        onClick={() => unlist(asset.itemId)}
                      >
                        Unlist
                      </button>
                    )}
                    {!asset.listing && (
                      <button
                        className="font-bold mt-4 bg-blue-300 text-white rounded shadow-lg"
                        style={{ width: "100px", height: "40px" }}
                      >
                        List
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default Assets;
