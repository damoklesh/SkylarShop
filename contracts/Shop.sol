// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "./Interfaces/IShop.sol";
import "./PoToken.sol";
import "./ItemDndNFT.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
/**
 * @dev Interface representing a virtual Shop.
 */
contract Shop is IShop, Ownable {

    address private _poTokenContractAddress;

    address private _itemDnDNFTAddress;

    ItemDndNFT private itemNftContract;

    PoToken private poToken;


    constructor (address poTokenContract, address itemDndNFTAddress) {

        //FIXME why address doubled
        _poTokenContractAddress = poTokenContract;

        poToken = PoToken(_poTokenContractAddress);

        itemNftContract = ItemDndNFT(itemDndNFTAddress);
    }

     function buyItem(uint256 itemId, uint256 amountPaid) external override returns (bool) {

        // Check if the amountPaid is enough to buy the item.
        require(amountPaid == itemNftContract.getItemValue(itemId),"The sent amount has to be equal to the item value");

        // Substract sent value from user PO total
        // Ask for approval on UI
        (bool transferSucceded)  = poToken.transferFrom(msg.sender, address(this),amountPaid);

        require(transferSucceded == true, "The Payment failed");
        // Buy the item, transfering the token. Set this contract as operator on FE side( setApprovalForAll)
        itemNftContract.safeTransferFrom(address(this),msg.sender,itemId,"");

        // Emit Event and return
        emit itemBoughtEvent(msg.sender, itemId, amountPaid);

        return true;
     }

    function addItem(string calldata name, uint256 weight, uint256 itemValue) external override onlyOwner {
        
        // FIXME This is done on the nft contract.
        // Add The item
        //ownedItems[address(0)][_itemsCount] = Item(_itemsCount,weight, name,itemValue);

        // FIXME mint the item to the shop contract address
        // The shop should have a minter role or owner?
        // This action will raise a Transfer event
        // The contract is minting on his behalf.
        itemNftContract.mint(address(this), name,weight,itemValue);

        // FIXME delete after tests
        //emit itemAddedEvent(msg.sender, _itemsCount, itemValue);
    }

}