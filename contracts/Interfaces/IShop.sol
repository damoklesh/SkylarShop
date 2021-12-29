// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

/**
 * @dev Interface representing a virtual Shop.
 */
interface IShop {
    
    /// @notice Buy the given item designed by the id parameter.
    /// @dev Explain to a developer any extra details
    /// @param amountPaid The amount paid for the item in P.O.
    /// @return True if the buy was successful, false otherwise.
    function buyItem(uint256 itemId, uint256 amountPaid) external returns (bool);

    /// @dev Adds and item to the shop catalog.
    /// @param itemValue The value of the item in P.O.
    function addItem(string calldata name, uint256 weight, uint256 itemValue) external;

    /// @dev Emitted when a new item has been bought.
    /// @param itemValue The value of the item in P.O.
    event itemBoughtEvent(address indexed buyer, uint256 itemId, uint256 itemValue);

    /// @dev Emitted when a new item has been added.
    /// @param itemValue The value of the item in P.O.
    event itemAddedEvent(address indexed from, uint256 itemId, uint256 itemValue);

}