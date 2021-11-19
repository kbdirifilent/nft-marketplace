import React, { useEffect } from "react";
import action from "../store/actions/MainActions";
import { useDispatch, useSelector } from "react-redux";

function Assets() {
  const dispatch = useDispatch();
  const provider = useSelector((state) => state.provider);
  const assets = useSelector((state) => state.assets);

  useEffect(() => {
    if (provider.blockchain !== null) {
      dispatch({ type: "ASSETS_LOADING", payload: null });
      dispatch(action.asset.FetchAssets());
    }
  }, [provider.blockchain]);

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
              >
                <img src={asset.image} alt="nft" className="rounded" />
                <div className="p-4 bg-pink-500">
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
                      {!asset.listing && (
                        <button
                          className="font-bold mt-4 bg-blue-300 text-white rounded shadow-lg"
                          style={{ width: "100px", height: "40px" }}
                        >
                          List
                        </button>
                      )}
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
