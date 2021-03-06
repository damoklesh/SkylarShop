// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "./Interfaces/IShop.sol";
import "./PoToken.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
/**
 * @dev Interface representing a virtual Shop.
 */
contract Shop is IShop, Ownable {

   
    // Structure of an item. This should be changed lately with a ERC721 or similar NFT.
    struct Item {
        uint256 id;
        uint256 weight;
        string name;
        uint256 value;
    }

    // Owned items by owner.
    // Items on address(0) can be bought by customers.
    mapping(address => mapping(uint256 => Item)) public ownedItems;

    // @devs Total number of items;
    uint256 private _itemsCount;

    address private _poTokenContractAddress;

    PoToken private poToken;


    constructor (address poTokenContract) {
        _itemsCount = 1;

        _poTokenContractAddress = poTokenContract;

        poToken = PoToken(_poTokenContractAddress);
    }

     function buyItem(uint256 itemId, uint256 amountPaid) external override returns (bool) {

        // check that the item is available (on address(0))
        require(ownedItems[address(0)][itemId].id == itemId, "The selected item is not available.");

        // Check if the amountPaid is enough to buy the item.
        require(amountPaid == ownedItems[address(0)][itemId].value,"The sent amount has to be equal to the item value");

        // Substract sent value from user PO total
        // Ask for approval on UI
        (bool transferSucceded)  = poToken.transferFrom(msg.sender, address(this),amountPaid);

        require(transferSucceded == true, "The Payment failed");
        // Buy the item, updating the mapping
        ownedItems[msg.sender][itemId] = ownedItems[address(0)][itemId];

        // delete the item held by the shop.
        delete(ownedItems[address(0)][itemId]);

        // Emit Event and return
        emit itemBoughtEvent(msg.sender, itemId, amountPaid);

        // video polizei https://twitter.com/LFConaction/status/1476160967071477763
        return true;
     }

    function addItem(string calldata name, uint256 weight, uint256 itemValue) external override onlyOwner {
        
        // check if the item already exist. DONT IMPLEMENT, expensive, maybe different with NFTs.
        
        // Add The item
        ownedItems[address(0)][_itemsCount] = Item(_itemsCount,weight, name,itemValue);
  
        // emit event
        emit itemAddedEvent(msg.sender, _itemsCount, itemValue);

        _itemsCount++;
    }

}