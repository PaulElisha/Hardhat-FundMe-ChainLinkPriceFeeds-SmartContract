// Network config to deploy to different network based on their pricefeeds

const networkConfig = {
    11155111: {
        name: "sepolia",
        ethUsdDataFeedAddress: "0x694AA1769357215DE4FAC081bf1f309aDC325306"
    },
}

const developmentChains = ["hardhat", "localhost"]

module.exports = { networkConfig, developmentChains }