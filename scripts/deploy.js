const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const Crowdfund = await hre.ethers.getContractFactory("Crowdfund");
  const crowdfund = await Crowdfund.deploy();

  await crowdfund.deployed();

  console.log("Crowdfund deployed to:.......", crowdfund.address);

  fs.writeFileSync(
    "./config.js",
    `
  export const contractAddress = "${crowdfund.address}"
  `
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
