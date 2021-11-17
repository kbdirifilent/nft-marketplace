import logo from "./logo.svg";
import "./App.css";
import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import store from "./store/store";
import action from "./store/actions/MainActions";

function Home() {
  return (
    <div>
      <button onClick={() => console.log(store.getState().provider)}>
        click
      </button>
      <button onClick={() => store.dispatch(action.asset.FetchAssets())}>
        Load
      </button>
    </div>
  );
}

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(action.blockchain.GetProvider());
    window.ethereum.on("networkChanged", function (networkId) {
      dispatch(action.blockchain.GetProvider());
    });
  }, []);

  // useEffect(() => {
  //   if (store.getState().provider) {
  //     store.dispatch(action.asset.FetchAssets());
  //   }
  // }, [store.getState().provider]);

  return (
    <React.Fragment>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </React.Fragment>
  );
}

export default App;
