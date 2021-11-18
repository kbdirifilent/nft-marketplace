import React from "react";

function List() {
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
        />
        <input
          type="text"
          className="col mt-2 mr-2 border rounded p-3"
          size="25"
          placeholder="token ID"
        />
        <input
          type="text"
          className="col mt-2 border rounded p-3"
          size="25"
          placeholder="price (MATIC)"
        />
      </div>
      <div className="px-20">
        <button
          className="font-bold mt-4 bg-pink-500 text-white rounded shadow-lg"
          style={{ width: "100px", height: "40px" }}
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
        <input placeholder="Asset Name" className=" border rounded p-4" />
        <textarea
          placeholder="Asset Description"
          className="mt-2 border rounded p-4"
        />
        <label for="Asset" className="mt-4">
          Asset Image
        </label>
        <input type="file" name="Asset" className="my-4" />
        <button
          className="font-bold mt-4 bg-pink-500 text-white rounded shadow-lg"
          style={{ width: "100px", height: "40px" }}
        >
          Create
        </button>
      </div>
    </div>
  );
}

export default List;
