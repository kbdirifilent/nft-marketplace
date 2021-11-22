import toast from "react-hot-toast";
import { nftaddress, nftmarketaddress } from "../config";

import { ethers } from "ethers";

const ListService = {
  list: async (provider, url, formInput, navigate) => {
    const createTokenPromise = provider.nftContract.createToken(url);
    toast.promise(createTokenPromise, {
      loading: "Creating your NFT",
      success: "Done, confirming...",
      error: "Error minting",
    });
    let transaction = await createTokenPromise;
    let transactionPromise = transaction.wait();
    toast.promise(transactionPromise, {
      loading: "Confirming Transaction",
      success: "Done",
      error: "Error",
    });
    let tx = await transactionPromise;

    let event = tx.events[0];
    let value = event.args[2];
    let tokenId = value.toNumber();
    console.log("tokenId", tokenId);

    const price = ethers.utils.parseUnits(formInput.price, "ether");

    const listingDataPromise = provider.nftMarketContract.listingFee();
    toast.promise(listingDataPromise, {
      loading: "Retrieving Listing data",
      success: "Done",
      error: "Error retrieving Listing data",
    });
    let listingFee = await listingDataPromise;
    listingFee = listingFee.toString();

    const listPromise = provider.nftMarketContract.list(
      nftaddress,
      tokenId,
      price,
      {
        value: listingFee,
      }
    );
    toast.promise(listPromise, {
      loading: "Perform listing",
      success: "Done, confirming...",
      error: "Error listing",
    });
    transaction = await listPromise;
    transactionPromise = transaction.wait();
    toast.promise(transactionPromise, {
      loading: "Confirming Transaction",
      success: "Done",
      error: "Error",
    });
    await transactionPromise;
    window.location.reload();
    navigate("/assets");
  },
  unlist: async (provider, itemId) => {
    const unlistPromise = provider.nftMarketContract.unlist(itemId);
    toast.promise(unlistPromise, {
      loading: "Unlisting",
      success: "Done",
      error: "Error",
    });
    const tx = await unlistPromise;
    const transactionPromise = tx.wait();
    toast.promise(transactionPromise, {
      loading: "Confirming Transaction",
      success: "Done",
      error: "Error",
    });
    await transactionPromise;
    window.location.reload();
  },
  listExisting: async (provider, listInput, navigate) => {
    const { address, tokenId, price } = listInput;
    if (!address || !tokenId || !price) return;

    let listingFee = await provider.nftMarketContract.listingFee();
    listingFee = listingFee.toString();

    let listPromise = provider.nftMarketContract.list(
      listInput.address,
      listInput.tokenId,
      ethers.utils.parseUnits(listInput.price.toString(), "ether"),
      {
        value: listingFee,
      }
    );
    toast.promise(listPromise, {
      loading: "Perform listing",
      success: "Done",
      error: "Error uploading",
    });
    let transaction = await listPromise;
    let transactionPromise = transaction.wait();
    toast.promise(transactionPromise, {
      loading: "Confirming Transaction",
      success: "Done",
      error: "Error",
    });

    await transactionPromise;
    window.location.reload();
    navigate("/assets");
  },
};

export default ListService;
