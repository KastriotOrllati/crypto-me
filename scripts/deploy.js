const hre = require("hardhat");

async function main() {
  const Crowdfund = await hre.ethers.getContractFactory("Crowdfund");
  const crowdfund = await Crowdfund.deploy();

  await crowdfund.deployed();

  console.log("Donation deployed to:.......", crowdfund.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
