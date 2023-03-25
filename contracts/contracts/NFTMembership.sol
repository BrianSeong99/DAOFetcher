// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFTMembership is ERC721URIStorage {
    constructor(string memory name, string memory symbol) ERC721(name, symbol) {}

    function mintToken(address _to, uint256 _tokenId) public {
        _mint(_to, _tokenId);
    }

    function setTokenURI(uint256 _tokenId, string memory _tokenURI) public {
        _setTokenURI(_tokenId, _tokenURI);
    }

    function exists(uint256 _tokenId) public view returns (bool) {
        return _exists(_tokenId);
    }
}