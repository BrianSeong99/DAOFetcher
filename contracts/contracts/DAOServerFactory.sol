pragma solidity ^0.8.0;

import "contracts/DAOServer.sol";

contract DAOServerFactory {
    address[] public daoServers;

    function createDAOServer(
        string memory _daoName, 
        string memory _daoDescription, 
        string memory _adminURI, 
        string[] memory _names, 
        string[] memory _symbols, 
        string[] memory _tokenURIes, 
        uint256[] memory _durations, 
        uint256[] memory _prices
    ) public {
        DAOServer newDAOServer = new DAOServer(
            msg.sender, 
            _daoName, 
            _daoDescription, 
            _adminURI, 
            _names,
            _symbols,
            _tokenURIes,
            _durations,
            _prices
        );
        daoServers.push(address(newDAOServer));
    }

    function getAllDAOServers() public view returns (address[] memory) {
        return daoServers;
    }

    function getUserDAOServerRelations(address _user) public view returns (address[] memory) {
        address[] memory userRelations = new address[](daoServers.length);

        for (uint i = 0; i < daoServers.length; i++) {
            DAOServer daoServer = DAOServer(daoServers[i]);
            if (daoServer.isUserMember(_user)) {
                userRelations[i] = daoServers[i];
            }
        }

        return userRelations;
    }
}