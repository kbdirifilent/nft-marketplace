import "./App.css";
import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import action from "./store/actions/MainActions";
import Home from "./Components/Home";
import Assets from "./Components/Assets";
import List from "./Components/List";
import NavigationBar from "./Components/NavigationBar";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({ type: "PROVIDER_LOADING", payload: null });
    dispatch(action.blockchain.GetProvider());
    window.ethereum.on("networkChanged", function (networkId) {
      dispatch(action.blockchain.GetProvider());
    });
  }, []);

  return (
    <React.Fragment>
      <NavigationBar />
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/assets" element={<Assets />} />
          <Route exact path="/list" element={<List />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="botom-center" />
    </React.Fragment>
  );
}

export default App;
