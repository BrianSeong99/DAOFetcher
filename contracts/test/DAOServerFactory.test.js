const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DAOServerFactory", function () {
  let DAOServerFactory, DAOServer, NFTMembership;
  let daoServerFactory, daoServer, nftMembership;
  let owner, addr1, addr2;
  let newlyRegisteredMembershipTypes = [];

  const fs = require("fs");
  const path = require("path");

  const jsonFilePath = path.resolve(__dirname, "./daoData.json");
  const daoData = JSON.parse(fs.readFileSync(jsonFilePath, "utf-8"));

  const createMoreDAOs = async (addr) => {
    for (let i = 0; i < daoData.length; i++) {
      await daoServerFactory.connect(addr).createDAOServer(
        daoData[i].daoName,
        daoData[i].daoDescription,
        daoData[i].adminURI,
        daoData[i].memberships.names,
        daoData[i].memberships.symbols,
        daoData[i].memberships.tokenURIs,
        daoData[i].memberships.durations,
        daoData[i].memberships.prices.map((price) =>
          ethers.utils.parseEther(price.toString())
        )
      );
    }
  };

  const updateNewlyRegisteredMembershipTypes = async (addr) => {
    const allDAOServers = await daoServerFactory.getAllDAOServers();
    DAOServer = await ethers.getContractFactory("DAOServer");
    newlyRegisteredMembershipTypes = [];

    for (let i = 0; i < allDAOServers.length; i++) {
      daoServer = DAOServer.attach(allDAOServers[i]);
      const membershipTypes = await daoServer.getAllMembershipTypes();
      const membershipTypeForDaoData = getRandomInt(membershipTypes.length - 1);
      newlyRegisteredMembershipTypes.push(membershipTypeForDaoData + 1);
      const price = membershipTypes[membershipTypeForDaoData + 1].price;
      await daoServer
        .connect(addr)
        .mintNoneAdminMembership(addr.address, membershipTypeForDaoData + 1, {
          value: price + 1,
        });
    }
  };

  const getRandomInt = (x) => {
    return Math.floor(Math.random() * x);
  };

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    DAOServerFactory = await ethers.getContractFactory("DAOServerFactory");
    NFTMembership = await ethers.getContractFactory("NFTMembership");
    DAOServer = await ethers.getContractFactory("DAOServer");

    daoServerFactory = await DAOServerFactory.deploy();
    await daoServerFactory.deployed();

    await createMoreDAOs(owner);
    await updateNewlyRegisteredMembershipTypes(addr1);
  });

  it("Should create new DAOServers", async function () {
    const allDAOServers = await daoServerFactory.getAllDAOServers();
    expect(allDAOServers.length).to.equal(daoData.length);
  });

  it("Should get All Dao infos and compare", async function () {
    const allDAOServers = await daoServerFactory.getAllDAOServers();
    DAOServer = await ethers.getContractFactory("DAOServer");
    for (let i = 0; i < allDAOServers.length; i++) {
      daoServer = DAOServer.attach(allDAOServers[i]);
      const membershipTypes = await daoServer.getAllMembershipTypes();
      for (let j = 1; j < membershipTypes.length; j++) {
        expect(membershipTypes[j].name).to.equal(
          daoData[i].memberships.names[j - 1]
        );
        expect(membershipTypes[j].symbol).to.equal(
          daoData[i].memberships.symbols[j - 1]
        );
        expect(membershipTypes[j].tokenURI).to.equal(
          daoData[i].memberships.tokenURIs[j - 1]
        );
        expect(membershipTypes[j].duration).to.equal(
          daoData[i].memberships.durations[j - 1]
        );
        expect(membershipTypes[j].price).to.equal(
          ethers.utils.parseEther(
            daoData[i].memberships.prices[j - 1].toString()
          )
        );
      }
    }
  });

  it("Should mint a new membership", async function () {
    const membershipType = 1;
    const price = ethers.utils.parseEther(
      daoData[0].memberships.prices[membershipType].toString()
    );

    await daoServer
      .connect(addr2)
      .mintNoneAdminMembership(addr2.address, membershipType, {
        value: price + 1,
      });

    const userMembershipType = await daoServer.userMembershipType(
      addr2.address
    );
    expect(userMembershipType).to.equal(membershipType);
  });

  it("Should mint multiple new membership for addr2 and get all memberships", async function () {
    await createMoreDAOs(addr1);
    await updateNewlyRegisteredMembershipTypes(addr2);

    const allDAOServers = await daoServerFactory.getAllDAOServers();

    // getting all dao's membership status.
    for (let i = 0; i < allDAOServers.length; i++) {
      daoServer = DAOServer.attach(allDAOServers[i]);
      const userMembershipType = await daoServer.userMembershipType(
        addr2.address
      );
      expect(userMembershipType).to.equal(newlyRegisteredMembershipTypes[i]);
    }
  });

  it("Should revert if trying to mint with insufficient payment", async function () {
    const membershipType = 1;

    await expect(
      daoServer
        .connect(addr1)
        .mintNoneAdminMembership(addr1.address, membershipType, {
          value: ethers.utils.parseEther("0.1"),
        })
    ).to.be.revertedWith("Insufficient payment.");
  });

  it("Should return user DAO server relations", async function () {
    const allDAOServers = await daoServerFactory.getAllDAOServers();

    const userRelations = await daoServerFactory.getUserDAOServerRelations(
      addr1.address
    );
    // console.log(userRelations);

    for (let i = 0; i < newlyRegisteredMembershipTypes.length; i++) {
      expect(userRelations[i].daoAddress).to.equal(allDAOServers[i]);
      expect(userRelations[i].membershipType).to.equal(
        newlyRegisteredMembershipTypes[i]
      );
      daoServer = DAOServer.attach(allDAOServers[i]);
      expect(userRelations[i].tokenId).to.equal(
        daoServer.userMembershipTokenId(addr1.address)
      );
    }
  });
});
