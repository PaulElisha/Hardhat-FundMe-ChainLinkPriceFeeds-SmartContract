const { ethers, getNamedAccounts } = require("hardhat")


const deploy = async () => {
  const sendVal = await ethers.utils.parseEthers("0.1")
  const { deployer } = await getNamedAccounts();
  const fundMe = await ethers.getContract("FundMe", deployer);
  console.log("Funding Contract...");
  const txresponse = await fundMe.fund({ value: sendVal })
  await txresponse.wait(1)
  console.log("Funded!")
}


const verify = async (contractAddress, args) => {
  console.log("Verifying contract address...")

  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArgs: args,
    })
  } catch (error) {
    if (error.message.toLowerCase().includes("already verified")) {
      console.log("Already verified...!")
    } else {
      console.log(error)
    }
  }
}


deploy().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
