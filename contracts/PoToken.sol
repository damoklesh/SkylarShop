// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @title Gold Pieces ERC20 token.
/// @author Steve Leon
/// @notice ERC20 token representing a DnD gold piece.
/// @dev Extends the ERC20 standard.
contract PoToken is ERC20{

     constructor(uint256 initialSupply) ERC20("Gold Piece", "PO") {
        _mint(msg.sender, initialSupply);
    }

    function decimals() public view virtual override returns (uint8) {
        return 0;
    }

}