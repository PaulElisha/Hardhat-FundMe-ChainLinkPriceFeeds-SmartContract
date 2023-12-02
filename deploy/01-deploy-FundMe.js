const { network } = require("hardhat")
const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify.js");

const deployFundMe = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    // use developmentChains.includes(network.name) or chainId == 31337

    let ethUsdDataFeedAddress;

    if (developmentChains.includes(network.name)) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdDataFeedAddress = ethUsdAggregator.address;
    } else {
        ethUsdDataFeedAddress = networkConfig[chainId]["ethUsdDataFeedAddress"]
    }

    const args = [ethUsdDataFeedAddress]

    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: args, // constructor arguments
        log: true,
        waitConfirmations: network.config.blockConfirmations
    })
    log("............................................................................")

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(fundMe.address, args)
    }

}

module.exports.default = deployFundMe
module.exports.tags = ["all", "fundme"]
