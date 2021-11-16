// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract NFTMarketPlace is ReentrancyGuard, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _NFTIds;

    struct NFTItem {
        uint256 itemId; // the id of NFT in this marketplace contract
        uint256 tokenId; // the id of NFT in NFT contract
        address itemAddress;
        address owner;
        uint256 price;
        bool listing;
    }

    mapping(uint256 => NFTItem) public idToNFTItem;
    mapping(address => mapping(uint256 => uint256)) metadataToItemId; // nftAddress => tokenId => itemId

    uint256 public listingFee = 0.025 ether;

    constructor() Ownable() {}

    function list(
        address nftAddress,
        uint256 tokenId,
        uint256 price
    ) public payable nonReentrant {
        address owner = IERC721(nftAddress).ownerOf(tokenId);
        require(msg.value == listingFee, "Please provide the listing fee");
        if (owner != address(this)) {
            require(owner == msg.sender, "cannot list other's token");
            _NFTIds.increment();
            NFTItem memory Item = NFTItem(
                _NFTIds.current(),
                tokenId,
                nftAddress,
                owner,
                price,
                true
            );
            idToNFTItem[_NFTIds.current()] = Item;
            IERC721(nftAddress).transferFrom(
                msg.sender,
                address(this),
                tokenId
            ); // transfer the owner to the marketplace.
            metadataToItemId[nftAddress][tokenId] = _NFTIds.current();
        } else {
            // the owner is already the marketplace.
            uint256 id = metadataToItemId[nftAddress][tokenId];
            require(
                idToNFTItem[id].owner == msg.sender,
                "cannot list other's token"
            );
            require(
                id != 0,
                "the NFT is not listed by user, but rather native to the marketplace"
            );
            idToNFTItem[id].price = price;
            idToNFTItem[id].listing = true;
        }
    }

    function buy(uint256 itemId) public payable nonReentrant {
        NFTItem storage Item = idToNFTItem[itemId];
        require(Item.price != 0, "NFT is not existed");
        require(msg.value == Item.price, "For buying, pay the correct price");
        Item.listing = false;
        payable(Item.owner).transfer(msg.value); // pay to the owner
        Item.owner = msg.sender; // change owner
    }

    function withdraw(
        address nftAddress,
        uint256 tokenId,
        uint256 itemId
    ) public nonReentrant {
        NFTItem storage Item = idToNFTItem[itemId];
        require(Item.owner == msg.sender, "cannot withdraw other's token");
        IERC721(nftAddress).transferFrom(address(this), msg.sender, tokenId);
        delete idToNFTItem[itemId];
        delete metadataToItemId[nftAddress][tokenId];
    }
}
