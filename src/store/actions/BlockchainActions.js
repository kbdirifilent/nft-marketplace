import { ethers } from "ethers";
import Web3Modal from "web3modal";

function GetProvider() {
  return async (dispatch, getState) => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    console.log(provider);
    dispatch({ type: "PROVIDER", payload: provider });
  };
}
export { GetProvider };
export default { GetProvider };
