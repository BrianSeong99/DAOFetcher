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
    string daoName = "";
    string daoDescription = "";
    MembershipType[] public membershipTypes;

    mapping(address => uint256) public userMembershipType;
    mapping(address => uint256) public userMembershipTokenId;
    mapping(uint256 => uint256) private membershipTypeTokenCount;
    mapping(uint256 => uint256) public tokenExpiryTimestamp;

    

    modifier onlyAdmin() {
        require(msg.sender == admin || msg.sender == factoryAddress, "OnlyAdmin: caller is not the admin");
        _;
    }

    constructor(
        address _admin,
        string memory _daoName,
        string memory _daoDescription,
        string memory _adminURI, 
        string[] memory _names, 
        string[] memory _symbols, 
        string[] memory _tokenURIes, 
        uint256[] memory _durations, 
        uint256[] memory _prices
    ) {
        require(bytes(_daoName).length != 0);
        require(bytes(_adminURI).length != 0);
        require(
            _names.length == _symbols.length 
            && _names.length == _tokenURIes.length
            && _names.length == _durations.length
            && _names.length == _prices.length
            , "Different lengths"
        );
        
        daoName = _daoName;
        daoDescription = _daoDescription;

        factoryAddress = msg.sender;
        admin = _admin;
        _createDefaultAdminMembership(_adminURI);
        mintAdmin(admin);
        
        for (uint256 i = 0; i < _names.length; i ++) {
            addNewMembershipType(_names[i], _symbols[i], _tokenURIes[i], _durations[i], _prices[i]);
        }
    }

    function _createDefaultAdminMembership(string memory _adminURI) internal {
        NFTMembership defaultAdminToken = new NFTMembership("Admin", "ADM");
        MembershipType memory defaultAdminMembership = MembershipType({
            token: defaultAdminToken,
            name: "Admin",
            symbol: "ADM",
            tokenURI: _adminURI,
            duration: 100000000000000000000,
            price: 0
        });
        membershipTypes.push(defaultAdminMembership);
    }

    function mintAdmin(address _to) public onlyAdmin {
        uint256 adminType = 0;
        uint256 tokenId = membershipTypeTokenCount[adminType]; // Generate a unique token ID based on the membership type and counter
        membershipTypes[adminType].token.mintToken(_to, tokenId);
        membershipTypes[adminType].token.setTokenURI(tokenId, membershipTypes[adminType].tokenURI);
        userMembershipType[_to] = adminType;
        userMembershipTokenId[_to] = tokenId;
        membershipTypeTokenCount[adminType]++;
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

    function mintMembership(address _to, uint256 _type) public payable {
        require(_type < membershipTypes.length, "Invalid membership type.");
        require(msg.value >= membershipTypes[_type].price, "Insufficient payment.");
        require(_type != 0, "Can't mint admin type as none admin");
        
        if (userMembershipType[_to] != 0) {
            require(isTokenExpired(userMembershipTokenId[_to]), "NFT Not Expired yet, we don't support duplicate access yet");
        }

        uint256 tokenId = _type * 1e12 + membershipTypeTokenCount[_type]; // Generate a unique token ID based on the membership type and counter
        membershipTypes[_type].token.mintToken(_to, tokenId);

        membershipTypes[_type].token.setTokenURI(tokenId, membershipTypes[_type].tokenURI);

        uint256 duration = membershipTypes[_type].duration;
        tokenExpiryTimestamp[tokenId] = block.timestamp + duration;

        userMembershipType[_to] = _type;
        userMembershipTokenId[_to] = tokenId;
        membershipTypeTokenCount[_type]++;
    }

    function getAllMembershipTypes() public view returns (MembershipType[] memory) {
        return membershipTypes;
    }

    function isUserMember(address _user) public view returns (bool) {
        bool exist = membershipTypes[userMembershipType[_user]].token.exists(userMembershipTokenId[_user]);
        return exist && !isTokenExpired(userMembershipTokenId[_user]);
    }

    function isTokenExpired(uint256 tokenId) public view returns (bool) {
        return block.timestamp > tokenExpiryTimestamp[tokenId];
    }
}
