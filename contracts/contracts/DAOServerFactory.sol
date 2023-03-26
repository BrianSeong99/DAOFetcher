// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "contracts/DAOServer.sol";

contract DAOServerFactory {
    address[] public daoServers;
    mapping(string => bool) daoRegistered;

    struct userDaoRelation {
        address daoAddress;
        uint256 membershipType;
        uint256 tokenId;
    }

    function createDAOServer(
        string memory _daoName, 
        string memory _daoIconURL, 
        string memory _daoId,
        string[] memory _names, 
        string[] memory _symbols, 
        string[] memory _tokenURIes, 
        uint256[] memory _durations, 
        uint256[] memory _prices
    ) public {
        require(!daoRegistered[_daoId], "daoRegistered already");
        DAOServer newDAOServer = new DAOServer(
            msg.sender, 
            _daoName, 
            _daoIconURL, 
            _daoId, 
            _names,
            _symbols,
            _tokenURIes,
            _durations,
            _prices
        );
        daoServers.push(address(newDAOServer));
        daoRegistered[_daoId] = true;
    }

    function getAllDAOServers() public view returns (address[] memory) {
        return daoServers;
    }

    function getDAOServersLength() public view returns (uint256) {
        return daoServers.length;
    }

    function getUserDAOServerRelations(address _user) public view returns (userDaoRelation[] memory) {
        userDaoRelation[] memory userRelations = new userDaoRelation[](daoServers.length);

        for (uint i = 0; i < daoServers.length; i++) {
            DAOServer daoServer = DAOServer(daoServers[i]);
            if (daoServer.isUserMember(_user)) {
                userRelations[i].daoAddress = daoServers[i];
                userRelations[i].membershipType = daoServer.userMembershipType(_user);
                userRelations[i].tokenId = daoServer.userMembershipTokenId(_user);
            }
        }

        return userRelations;
    }
}