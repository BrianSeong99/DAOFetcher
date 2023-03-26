// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Strings.sol";
import "contracts/NFTMembership.sol";

contract DAOServer {
    using Strings for uint256;

    struct MembershipType {
        NFTMembership token;
        string name;
        string symbol;
        string tokenURI;
        uint256 duration;
        uint256 price;
    }

    address public admin;
    address public factoryAddress;
    string public daoName = "";
    string public daoIconURL = "";
    string public daoId = "";
    MembershipType[] public membershipTypes;

    mapping(address => uint256) public userMembershipType;
    mapping(address => uint256) public userMembershipTokenId;
    mapping(uint256 => uint256) public membershipTypeTokenCount;
    mapping(uint256 => uint256) public tokenExpiryTimestamp;

    modifier onlyAdmin() {
        require(msg.sender == admin || msg.sender == factoryAddress, "OnlyAdmin");
        _;
    }

    constructor(
        address _admin,
        string memory _daoName,
        string memory _daoIconURL,
        string memory _daoId, 
        string[] memory _names, 
        string[] memory _symbols, 
        string[] memory _tokenURIes, 
        uint256[] memory _durations, 
        uint256[] memory _prices
    ) {
        require(_names.length > 0 
            && _names.length <= 3 
            && _names.length == _symbols.length 
            && _names.length == _tokenURIes.length 
            && _names.length == _durations.length 
            && _names.length == _prices.length, 
            "length error"
        );
        
        daoName = _daoName;
        daoIconURL = _daoIconURL;
        daoId = _daoId;

        factoryAddress = msg.sender;
        admin = _admin;
        addNewMembershipType("Admin", "ADM", _daoIconURL, 100000000000000000000, 0);
        mintAdmin(admin);
        
        for (uint256 i = 0; i < _names.length; i ++) {
            addNewMembershipType(_names[i], _symbols[i], _tokenURIes[i], _durations[i], _prices[i]);
        }
    }

    function addNewMembershipType(string memory _name, string memory _symbol, string memory _tokenURI, uint256 _duration, uint256 _price) public onlyAdmin {
        NFTMembership newToken = new NFTMembership(_name, _symbol);
        MembershipType memory newMembershipType = MembershipType({
            token: newToken,
            name: _name,
            symbol: _symbol,
            tokenURI: _tokenURI,
            duration: _duration,
            price: _price
        });
        membershipTypes.push(newMembershipType);
    }

    function mintAdmin(address _to) public onlyAdmin {
        mintMembership(_to, 0);
    }

    function mintNoneAdminMembership(address _to, uint256 _type) public payable {
        require(_type < membershipTypes.length, "Invalid type");
        require(msg.value >= membershipTypes[_type].price, "Insufficient");
        require(_type != 0, "Can't mint admin");
        // if (userMembershipType[_to] != 0) {
        //     require(block.timestamp < tokenExpiryTimestamp[userMembershipTokenId[_to]], "NFT Not Expired yet, we don't support duplicate access yet");
        // }
        mintMembership(_to, _type);
    }

    function mintMembership(address _to, uint256 _type) internal {
        uint256 tokenId = _type * 1e12 + membershipTypeTokenCount[_type]; // Generate a unique token ID based on the membership type and counter
        membershipTypes[_type].token.mintToken(_to, tokenId);
        membershipTypes[_type].token.setTokenURI(tokenId, membershipTypes[_type].tokenURI);
        uint256 expirationDate = membershipTypes[_type].duration + block.timestamp;
        tokenExpiryTimestamp[tokenId] = expirationDate;
        userMembershipType[_to] = _type;
        userMembershipTokenId[_to] = tokenId;
        membershipTypeTokenCount[_type]++;
    }

    function getAllMembershipTypes() public view returns (MembershipType[] memory) {
        return membershipTypes;
    }

    function isUserMember(address _user) public view returns (bool) {
        bool exist = membershipTypes[userMembershipType[_user]].token.exists(userMembershipTokenId[_user]);
        return exist && block.timestamp < tokenExpiryTimestamp[userMembershipTokenId[_user]];
    }
}
