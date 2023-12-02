const { network } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")

const DECIMALS = 8
const INITIAL_ANSWER = 200_000_000_000

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();

    // use developmentChains.includes(network.name) or chainId == 31337

    if (developmentChains.includes(network.name)) {
        log("Local Network detected, deploying Mock..")
        const mockV3Aggregator = await deploy("MockV3Aggregator", {
            from: deployer,
            log: true,
            args: [DECIMALS, INITIAL_ANSWER]
        })
        log("Mocks deployed...!")
        log(mockV3Aggregator.address)
        log("............................................................................")
    }

}

module.exports.tags = ["all", "mocks"]