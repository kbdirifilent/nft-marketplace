import React, { useEffect } from "react";
import action from "../store/actions/MainActions";
import { useDispatch, useSelector } from "react-redux";

function Assets() {
  const dispatch = useDispatch();
  const provider = useSelector((state) => state.provider);
  const assets = useSelector((state) => state.assets);

  useEffect(() => {
    if (provider !== null) {
      dispatch({ type: "ASSETS_LOADING", payload: null });
      dispatch(action.asset.FetchAssets());
    }
  }, [provider]);

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
            <div key={i} className="border shadow rounded-xl overflow-hidden">
              <img src={asset.image} alt="nft" className="rounded" />
              <div className="p-4 bg-black">
                <p className="text-2xl font-bold text-white">
                  Price - {asset.price} MATIC
                </p>
              </div>
            </div>;
          })}
      </div>
    </div>
  );
}

export default Assets;
