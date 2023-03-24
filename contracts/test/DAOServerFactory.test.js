const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DAOServerFactory", function () {
  let DAOServerFactory, DAOServer, NFTMembership;
  let daoServerFactory, daoServer, nftMembership;
  let owner, addr1, addr2;

  const fs = require("fs");
  const path = require("path");

  const jsonFilePath = path.resolve(__dirname, "./daoData.json");
  const daoData = JSON.parse(fs.readFileSync(jsonFilePath, "utf-8"));

  const createMoreDAOs = async () => {
    for (let i = 1; i < daoData.length; i++) {
      await daoServerFactory.createDAOServer(
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

  const getRandomInt = (x) => {
    return Math.floor(Math.random() * x);
  };

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    DAOServerFactory = await ethers.getContractFactory("DAOServerFactory");
    daoServerFactory = await DAOServerFactory.deploy();
    await daoServerFactory.deployed();

    await daoServerFactory.createDAOServer(
      daoData[0].daoName,
      daoData[0].daoDescription,
      daoData[0].adminURI,
      daoData[0].memberships.names,
      daoData[0].memberships.symbols,
      daoData[0].memberships.tokenURIs,
      daoData[0].memberships.durations,
      daoData[0].memberships.prices.map((price) =>
        ethers.utils.parseEther(price.toString())
      )
    );

    const daoServers = await daoServerFactory.getAllDAOServers();
    DAOServer = await ethers.getContractFactory("DAOServer");
    daoServer = DAOServer.attach(daoServers[0]);

    NFTMembership = await ethers.getContractFactory("NFTMembership");
  });

  it("Should create one new DAOServer", async function () {
    const allDAOServers = await daoServerFactory.getAllDAOServers();
    expect(allDAOServers.length).to.equal(1);
  });

  it("Should create more new DAOServers", async function () {
    await createMoreDAOs();
    const allDAOServers = await daoServerFactory.getAllDAOServers();
    expect(allDAOServers.length).to.equal(daoData.length);
  });

  it("Should get All Dao infos and compare", async function () {
    await createMoreDAOs();
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
      .connect(addr1)
      .mintMembership(addr1.address, membershipType, {
        value: price + 1,
      });

    const userMembershipType = await daoServer.userMembershipType(
      addr1.address
    );
    expect(userMembershipType).to.equal(membershipType);
  });

  it("Should mint multiple new membership for addr1 and get all memberships", async function () {
    await createMoreDAOs();

    let allDAOServers = await daoServerFactory.getAllDAOServers();
    const newlyRegisteredMembershipTypes = [];

    expect(allDAOServers.length).to.equal(daoData.length);

    for (let i = 0; i < allDAOServers.length; i++) {
      daoServer = DAOServer.attach(allDAOServers[i]);
      const membershipTypeForDaoData = getRandomInt(
        daoData[i].memberships.names.length - 1
      );
      newlyRegisteredMembershipTypes.push(membershipTypeForDaoData + 1);
      const price = ethers.utils.parseEther(
        daoData[i].memberships.prices[membershipTypeForDaoData].toString()
      );
      await daoServer
        .connect(addr1)
        .mintMembership(addr1.address, membershipTypeForDaoData + 1, {
          value: price + 1,
        });
    }

    await daoServerFactory.connect(addr1).createDAOServer(
      daoData[0].daoName,
      daoData[0].daoDescription,
      daoData[0].adminURI,
      daoData[0].memberships.names,
      daoData[0].memberships.symbols,
      daoData[0].memberships.tokenURIs,
      daoData[0].memberships.durations,
      daoData[0].memberships.prices.map((price) =>
        ethers.utils.parseEther(price.toString())
      )
    );
    newlyRegisteredMembershipTypes.push(0);

    allDAOServers = await daoServerFactory.getAllDAOServers();

    // getting all dao's membership status.
    for (let i = 0; i < allDAOServers.length; i++) {
      daoServer = DAOServer.attach(allDAOServers[i]);
      const userMembershipType = await daoServer.userMembershipType(
        addr1.address
      );
      expect(userMembershipType).to.equal(newlyRegisteredMembershipTypes[i]);
    }
  });

  it("Should revert if trying to mint with insufficient payment", async function () {
    const membershipType = 1;

    await expect(
      daoServer.connect(addr1).mintMembership(addr1.address, membershipType, {
        value: ethers.utils.parseEther("0.1"),
      })
    ).to.be.revertedWith("Insufficient payment.");
  });

  it("Should return user DAO server relations", async function () {
    const membershipType = 1;
    const price = ethers.utils.parseEther(
      daoData[0].memberships.prices[membershipType].toString()
    );

    await daoServer
      .connect(addr1)
      .mintMembership(addr1.address, membershipType, {
        value: price + 1,
      });

    const userRelations = await daoServerFactory.getUserDAOServerRelations(
      addr1.address
    );

    expect(userRelations[0]).to.equal(daoServer.address);
  });
});
