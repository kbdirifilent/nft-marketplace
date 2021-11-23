const { expect } = require("chai");
const { ethers } = require("hardhat");
let market;
let marketAddress;
let nft;
let nftContractAddress;
let listingPrice;
let buyer1, buyer2, buyer3, buyer4, seller1, seller2, seller3, seller4;

function ETH(num) {
  return ethers.utils.parseUnits(num.toString(), "ether");
}

function toNFTItem(item) {
  return {
    itemId: item.itemId.toString(),
    tokenId: item.tokenId.toString(),
    itemAddress: item.itemAddress,
    owner: item.owner,
    price: item.price.toString(),
    listing: item.listing,
  };
}

describe("NFTMarket", () => {
  beforeEach(async () => {
    const Market = await ethers.getContractFactory("NFTMarketPlace");
    market = await Market.deploy();
    await market.deployed();
    marketAddress = market.address;

    const NFT = await ethers.getContractFactory("NFT");
    nft = await NFT.deploy(marketAddress);
    await nft.deployed();
    nftContractAddress = nft.address;

    listingPrice = await market.listingFee();
    listingPrice = listingPrice.toString();

    [buyer1, buyer2, buyer3, buyer4, seller1, seller2, seller3, seller4] =
      await ethers.getSigners();
    await nft.connect(seller1).createToken("https://token1.com"); // id 1
    await nft.connect(seller2).createToken("https://token2.com"); // id 2
  });

  it("should list an NFT", async () => {
    await market
      .connect(seller1)
      .list(nftContractAddress, 1, ETH(3), { value: listingPrice });
    let NFTItem = await market.idToNFTItem(1);
    NFTItem = toNFTItem(NFTItem);
    let targetNFTItem = {
      itemId: "1",
      tokenId: "1",
      itemAddress: nftContractAddress,
      owner: seller1.address,
      price: ETH(3).toString(),
      listing: true,
    };
    expect(NFTItem).to.deep.equal(targetNFTItem);
  });

  it("should be able to buy listed NFT : owner changes and listing => false", async () => {
    await market
      .connect(seller1)
      .list(nftContractAddress, 1, ETH(3), { value: listingPrice });
    await market.connect(buyer1).buy(1, { value: ETH(3) });
    let NFTItem = await market.idToNFTItem(1);
    NFTItem = toNFTItem(NFTItem);
    let targetNFTItem = {
      itemId: "1",
      tokenId: "1",
      itemAddress: nftContractAddress,
      owner: buyer1.address,
      price: ETH(3).toString(),
      listing: false,
    };
    expect(NFTItem).to.deep.equal(targetNFTItem);
  });

  it("should list NFT if it's already in the marketplace asset", async () => {
    await market
      .connect(seller1)
      .list(nftContractAddress, 1, ETH(3), { value: listingPrice });
    await market.connect(buyer1).buy(1, { value: ETH(3) });
    await market
      .connect(buyer1)
      .list(nftContractAddress, 1, ETH(10), { value: listingPrice });
    let NFTItem = await market.idToNFTItem(1);
    NFTItem = toNFTItem(NFTItem);
    let targetNFTItem = {
      itemId: "1",
      tokenId: "1",
      itemAddress: nftContractAddress,
      owner: buyer1.address,
      price: ETH(10).toString(),
      listing: true,
    };
    expect(NFTItem).to.deep.equal(targetNFTItem);
  });

  it.only("should withdraw NFT from the marketplace", async () => {
    await market
      .connect(seller1)
      .list(nftContractAddress, 1, ETH(3), { value: listingPrice });
    await nft.connect(seller1).createToken("https://token3.com"); // id 3
    await market
      .connect(seller1)
      .list(nftContractAddress, 3, ETH(3), { value: listingPrice });
    await market.connect(buyer1).buy(1, { value: ETH(3) });
    let owner = await nft.ownerOf(1);
    expect(owner).to.equal(marketAddress);
    await market.connect(buyer1).withdraw(nftContractAddress, 1, 1);
    owner = await nft.ownerOf(1);
    expect(owner).to.equal(buyer1.address);
    let NFTItem = await market.idToNFTItem(1);
    NFTItem = toNFTItem(NFTItem);
    let targetNFTItem = {
      itemId: "0",
      tokenId: "0",
      itemAddress: "0x0000000000000000000000000000000000000000",
      owner: "0x0000000000000000000000000000000000000000",
      price: ETH(0).toString(),
      listing: false,
    };
    expect(NFTItem).to.deep.equal(targetNFTItem);
    // get address zero in ethers
    const items = await market.getAllAssets(seller1.address);
    expect(items.length).to.equal(1);
  });

  it("non-owner should not be able to list NFT", async () => {
    await market
      .connect(seller1)
      .list(nftContractAddress, 1, ETH(3), { value: listingPrice });
    await market.connect(buyer1).buy(1, { value: ETH(3) });
    await expect(
      market.connect(buyer2).list(nftContractAddress, 1, ETH(10), {
        value: listingPrice,
      })
    ).to.be.revertedWith("cannot list other's token");
  });

  it("non-owner should not be able to withdraw NFT", async () => {
    await market
      .connect(seller1)
      .list(nftContractAddress, 1, ETH(3), { value: listingPrice });
    await market.connect(buyer1).buy(1, { value: ETH(3) });
    await expect(
      market.connect(buyer2).withdraw(nftContractAddress, 1, 1)
    ).to.be.revertedWith("cannot withdraw other's token");
  });

  it("should not be able to buy unlisted NFTs", async () => {
    await market
      .connect(seller1)
      .list(nftContractAddress, 1, ETH(3), { value: listingPrice });
    await market.connect(buyer1).buy(1, { value: ETH(3) });
    await expect(
      market.connect(buyer2).buy(1, { value: ETH(3) })
    ).to.be.revertedWith("NFT is not listed");
  });

  it("should be able to get all assets", async () => {
    await market
      .connect(seller1)
      .list(nftContractAddress, 1, ETH(3), { value: listingPrice });
    await market
      .connect(seller2)
      .list(nftContractAddress, 2, ETH(3), { value: listingPrice });
    await market.connect(seller2).buy(1, { value: ETH(3) });
    const items = await market.getAllAssets(seller2.address);
    expect(items.length).to.equal(2);
  });

  it("should be able to get all listing assets", async () => {
    await market
      .connect(seller1)
      .list(nftContractAddress, 1, ETH(3), { value: listingPrice });
    await market
      .connect(seller2)
      .list(nftContractAddress, 2, ETH(3), { value: listingPrice });
    await market.connect(buyer1).buy(1, { value: ETH(3) });
    const items = await market.getAllListingAssets();
    expect(items.length).to.equal(1);
  });
});
