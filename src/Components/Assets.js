import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import action from "../store/actions/MainActions";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import NFTMarket from "../artifacts/contracts/NFTMarketPlace.sol/NFTMarketPlace.json";
import { nftaddress, nftmarketaddress } from "../config";
import toast from "react-hot-toast";
import ListService from "../Services/ListService";

function Assets() {
  const dispatch = useDispatch();
  const provider = useSelector((state) => state.provider.blockchain);
  const assets = useSelector((state) => state.assets);

  const navigate = useNavigate();

  const [hoverElement, setHoverElement] = useState(-1);

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

  const withdraw = async (nftaddress, tokenId, itemId) => {
    const withdrawPromise = provider.nftMarketContract.withdraw(
      nftaddress,
      tokenId,
      itemId
    );
    toast.promise(withdrawPromise, {
      loading: "withdrawing assets...",
      success: "Done",
      error: "Error withdrawal",
    });
    let transaction = await withdrawPromise;
    const transactionPromise = transaction.wait();
    toast.promise(transactionPromise, {
      loading: "Confirming Transaction",
      success: "Done",
      error: "Error",
    });
    await transactionPromise;
  };

  assets.assets = assets.assets.sort((a, b) => a.itemId - b.itemId);

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
                id={"asset" + asset.itemId}
                className="border shadow rounded-xl ml-2 mr-2 mb-1 overflow-hidden"
                style={{ height: "500px" }}
                onMouseEnter={() => setHoverElement(i)}
                onMouseLeave={() => setHoverElement(-1)}
              >
                {hoverElement === i && (
                  <div
                    style={{
                      position: "absolute",
                      float: "left",
                    }}
                  >
                    {!asset.listing && (
                      <button
                        className="font-bold mt-4 ml-2 bg-blue-300 text-white shadow-lg float-right"
                        style={{
                          width: "100px",
                          height: "40px",
                          borderRadius: "10px",
                        }}
                        onClick={() =>
                          withdraw(nftaddress, asset.tokenId, asset.itemId)
                        }
                      >
                        Withdraw
                      </button>
                    )}
                    {asset.listing && (
                      <button
                        className="font-bold mt-4 ml-2 bg-blue-300 text-white rounded shadow-lg"
                        style={{
                          width: "100px",
                          height: "40px",
                          borderRadius: "10px",
                        }}
                        onClick={() =>
                          ListService.unlist(provider, asset.itemId)
                        }
                      >
                        Unlist
                      </button>
                    )}
                    {!asset.listing && (
                      <button
                        className="font-bold mt-4 ml-2 bg-blue-300 text-white rounded shadow-lg"
                        style={{
                          width: "100px",
                          height: "40px",
                          borderRadius: "10px",
                        }}
                        onClick={() =>
                          ListService.listExisting(
                            provider,
                            {
                              address: nftaddress,
                              tokenId: asset.tokenId,
                              price: asset.price / 1e18,
                            },
                            navigate
                          )
                        }
                      >
                        List
                      </button>
                    )}
                  </div>
                )}

                <img
                  src={asset.image}
                  alt="nft"
                  className="rounded"
                  style={{ height: "50%", width: "100%" }}
                />
                <div className="p-4 bg-pink-500" style={{ height: "50%" }}>
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
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default Assets;
