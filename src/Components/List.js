import React, { useState } from "react";
import { ethers } from "ethers";
import { create as ipfsHttpClient } from "ipfs-http-client";
import { nftaddress, nftmarketaddress } from "../config";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

import ListService from "../Services/ListService";

const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");

function List() {
  const [fileUrl, setFileUrl] = useState(null);
  const [formInput, updateFormInput] = useState({
    price: "",
    name: "",
    description: "",
  });
  const [listInput, updateListInput] = useState({
    address: "",
    tokenId: "",
    price: "",
  });

  const navigate = useNavigate();
  const provider = useSelector((state) => state.provider.blockchain);

  async function onChange(e) {
    const file = e.target.files[0];
    try {
      const fileAddedPromise = client.add(file, {
        progress: (prog) => console.log(`received: ${prog}`),
      });
      toast.promise(fileAddedPromise, {
        loading: "Receiving Image File",
        success: "Image Received",
        error: "Error receiving Image file",
      });
      const added = await fileAddedPromise;
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      setFileUrl(url);
    } catch (e) {
      console.log(e);
    }
  }

  async function createItem() {
    const { name, description, price } = formInput;
    if (!name || !description || !price || !fileUrl) return;
    const data = JSON.stringify({ name, description, image: fileUrl });
    try {
      const uploadToIPFSPromise = client.add(data);
      toast.promise(uploadToIPFSPromise, {
        loading: "Uploading metadata to IPFS",
        success: "Done",
        error: "Error uploading",
      });
      const added = await uploadToIPFSPromise;
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      await ListService.list(provider, url, formInput, navigate);
    } catch (e) {
      console.log("Error uploading file: ", e);
    }
  }

  return (
    <div>
      <h1 className="px-20 py-10 text-3xl">List</h1>
      <p className="px-20 text-1xl">List your NFTs here</p>
      <div className="row px-20">
        <input
          type="text"
          className="col mt-2 mr-2 border rounded p-3"
          size="25"
          placeholder="token address"
          onChange={(e) =>
            updateListInput({ ...listInput, address: e.target.value })
          }
        />
        <input
          type="text"
          className="col mt-2 mr-2 border rounded p-3"
          size="25"
          placeholder="token ID"
          onChange={(e) =>
            updateListInput({ ...listInput, tokenId: e.target.value })
          }
        />
        <input
          type="text"
          className="col mt-2 border rounded p-3"
          size="25"
          placeholder="price (MATIC)"
          onChange={(e) =>
            updateListInput({ ...listInput, price: e.target.value })
          }
        />
      </div>
      <div className="px-20">
        <button
          className="font-bold mt-4 bg-pink-500 text-white rounded shadow-lg"
          style={{ width: "100px", height: "40px" }}
          onClick={() =>
            ListService.listExisting(provider, listInput, navigate)
          }
        >
          List
        </button>
      </div>
      <div className="mt-5 mb-4">
        <p className="px-20 text-1xl">
          Do not have your NFT yet? Create one below
        </p>
      </div>
      <div className="px-20 w-1/2 flex flex-col pb-12">
        <input
          placeholder="Asset Name"
          className=" border rounded p-4"
          onChange={(e) => {
            updateFormInput({ ...formInput, name: e.target.value });
          }}
        />
        <textarea
          placeholder="Asset Description"
          className="mt-2 border rounded p-4"
          onChange={(e) =>
            updateFormInput({ ...formInput, description: e.target.value })
          }
        />
        <input
          type="text"
          className="col mt-2 border rounded p-3"
          size="25"
          placeholder="price (MATIC)"
          onChange={(e) =>
            updateFormInput({ ...formInput, price: e.target.value })
          }
        />
        <label htmlFor="Asset" className="mt-4">
          Asset Image
        </label>
        <input type="file" name="Asset" className="my-4" onChange={onChange} />
        {fileUrl && <img className="rounded mt-4" width="350" src={fileUrl} />}

        <button
          className="font-bold mt-4 bg-pink-500 text-white rounded shadow-lg"
          style={{ width: "100px", height: "40px" }}
          onClick={createItem}
        >
          Create
        </button>
      </div>
    </div>
  );
}

export default List;
