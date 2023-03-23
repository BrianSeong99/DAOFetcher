const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DAOServerFactory", function () {
  let DAOServerFactory, DAOServer, NFTMembership;
  let daoServerFactory, daoServer, nftMembership;
  let owner, addr1, addr2;

  const daoName = "Test DAO";
  const daoDescription = "A test DAO";
  const adminURI = "https://example.com/metadata/admin.json";
  const names = ["Gold", "Silver"];
  const symbols = ["GLD", "SLV"];
  const tokenURIes = [
    "https://example.com/metadata/gold.json",
    "https://example.com/metadata/silver.json",
  ];
  const durations = [180 * 24 * 60 * 60, 90 * 24 * 60 * 60];
  const prices = [ethers.utils.parseEther("1"), ethers.utils.parseEther("0.5")];

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    DAOServerFactory = await ethers.getContractFactory("DAOServerFactory");
    daoServerFactory = await DAOServerFactory.deploy();
    await daoServerFactory.deployed();

    await daoServerFactory.createDAOServer(
      daoName,
      daoDescription,
      adminURI,
      names,
      symbols,
      tokenURIes,
      durations,
      prices
    );

    const daoServers = await daoServerFactory.getAllDAOServers();
    DAOServer = await ethers.getContractFactory("DAOServer");
    daoServer = DAOServer.attach(daoServers[0]);

    NFTMembership = await ethers.getContractFactory("NFTMembership");
  });

  it("Should create a new DAOServer", async function () {
    const allDAOServers = await daoServerFactory.getAllDAOServers();
    expect(allDAOServers.length).to.equal(1);
  });

  it("Should mint a new membership", async function () {
    const membershipType = 1;
    const price = prices[membershipType];

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
    const price = prices[membershipType];

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
