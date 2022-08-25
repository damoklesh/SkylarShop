// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/presets/ERC721PresetMinterPauserAutoId.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

// TODO change shop contract.

/// @title NFT representing a DnD item.
/// @author Steve Leon
/// @notice ERC721 NFT representing a DnD item.
/// @dev Extends the ERC721 standard.
contract ItemDndNFT is ERC721PresetMinterPauserAutoId {

using Counters for Counters.Counter;

    // Structure of an item.
    struct Item {
        uint256 weight;
        string name;
        uint256 value;
    }

constructor() 
ERC721PresetMinterPauserAutoId("ItemDndNFT", "IDnD", "baseURI") {}

    // Mapping of items structs by tokenId
    mapping(uint256 => Item) public itemsByTokenId;

    Counters.Counter private _tokenIdTracker;
        /**
     * @dev Creates a new token for `to`. Its token ID will be automatically
     * assigned (and available on the emitted {IERC721-Transfer} event).
     *
     * See {ERC721-_mint}.
     *
     * Requirements:
     *
     * - the caller must have the `MINTER_ROLE`.
     */
    function mint(address to, string memory itemName, uint256 itemWeight, uint256 itemValue) public virtual {
        // FIXME I need to find a way to make the Shop contract a Minter to uncomment this line.
        //require(hasRole(MINTER_ROLE, _msgSender()), "ERC721PresetMinterPauserAutoId: must have minter role to mint");

        // We cannot just use balanceOf to create the new tokenId because tokens
        // can be burned (destroyed), so we need a separate counter.
        _mint(to, _tokenIdTracker.current());

        // Add Item struct
        itemsByTokenId[_tokenIdTracker.current()] = Item(itemWeight, itemName,itemValue);

        _tokenIdTracker.increment();
    }
    
    /**
     * @dev See {IERC721Metadata-tokenURI}.
     */
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

        string memory baseURI = _baseURI(tokenId);
        return bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI, Strings.toString(tokenId))) : "";
    }

    /**
     * @dev Used for simplicity.
     * Getter: Gets the given item value.
     */
    function getItemValue(uint256 tokenId) public view virtual returns (uint256) {
        return itemsByTokenId[tokenId].value;
    }

    /**
     * @dev Base URI for computing {tokenURI}.
     */
    function _baseURI(uint256 tokenId) internal view virtual returns (string memory) {
        
         string memory json = Base64.encode(bytes(string(abi.encodePacked(abi.encodePacked(
                    '{"name": "', itemsByTokenId[tokenId].name, '",',
                    '"image_data": "",',
                    '"attributes": [{"trait_type": "Value", "value": ', Strings.toString(itemsByTokenId[tokenId].value), '},',
                    '{"trait_type": "Weight", "value": ', Strings.toString(itemsByTokenId[tokenId].weight), '},',
                    '{"trait_type": "id", "value": ', Strings.toString(tokenId), '}',
                    ']}'
                )))));
         return string(abi.encodePacked('data:application/json;base64,', json));

    
    }
}

