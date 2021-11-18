import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import AssetReducer from "./reducers/AssetReducer";
import ProviderReducer from "./reducers/BlockchainReducer";

const store = createStore(
  combineReducers({ assets: AssetReducer, provider: ProviderReducer }),
  applyMiddleware(thunk)
);

export default store;
