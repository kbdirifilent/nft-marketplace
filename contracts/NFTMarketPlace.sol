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
    mapping(address => uint256[]) ownerToItemIds; // owner to itemId

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
            ownerToItemIds[msg.sender].push(_NFTIds.current());
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

    function unlist(uint256 itemId) public nonReentrant {
        NFTItem storage nft = idToNFTItem[itemId];
        require(nft.owner == msg.sender, "cannot unlist other's NFT");
        nft.listing = false;
    }

    function buy(uint256 itemId) public payable nonReentrant {
        NFTItem storage Item = idToNFTItem[itemId];
        require(Item.price != 0, "NFT is not existed");
        require(Item.listing, "NFT is not listed");
        require(Item.owner != msg.sender, "Cannot buy your own NFT");
        require(msg.value == Item.price, "For buying, pay the correct price");
        Item.listing = false;
        payable(Item.owner).transfer(msg.value); // pay to the owner
        removeOwner(itemId, Item.owner);
        Item.owner = msg.sender; // change owner
        ownerToItemIds[msg.sender].push(itemId);
    }

    function find(uint256 itemId, address owner)
        private
        view
        returns (uint256)
    {
        for (uint256 i = 0; i < ownerToItemIds[owner].length; i++) {
            if (ownerToItemIds[owner][i] == itemId) {
                return i;
            }
        }
        revert("cannot seem to find the ownership of this particular item");
    }

    function removeOwner(uint256 itemId, address owner) private {
        uint256 index = find(itemId, owner);
        ownerToItemIds[owner][index] = ownerToItemIds[owner][
            ownerToItemIds[owner].length - 1
        ];
        delete ownerToItemIds[owner][ownerToItemIds[owner].length - 1];
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
        removeOwner(itemId, msg.sender);
    }

    function getAllAssets(address owner)
        public
        view
        returns (NFTItem[] memory)
    {
        uint256[] memory itemIds = ownerToItemIds[owner];
        NFTItem[] memory items = new NFTItem[](itemIds.length);
        for (uint256 i = 0; i < itemIds.length; i++) {
            items[i] = idToNFTItem[itemIds[i]];
        }
        return items;
    }

    function getAllListingAssets() public view returns (NFTItem[] memory) {
        uint256 currentId = _NFTIds.current();
        uint256 count = 0;
        for (uint256 i = 1; i <= currentId; i++) {
            if (idToNFTItem[i].listing) {
                count += 1;
            }
        }
        NFTItem[] memory items = new NFTItem[](count);
        uint256 j = 0;
        for (uint256 i = 1; i <= currentId; i++) {
            if (idToNFTItem[i].listing) {
                items[j] = idToNFTItem[i];
                j++;
            }
        }
        return items;
    }
}
