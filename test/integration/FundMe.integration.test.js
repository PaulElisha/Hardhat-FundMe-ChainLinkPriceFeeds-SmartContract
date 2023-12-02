const { getNamedAccounts, ethers, network } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

developmentChains.includes(network.name) ? describe.skip :
    describe("FundMe", async () => {
        let fundMe;
        let deployer;
        const sendValue = await ethers.utils.parseEthers("1")

        beforeEach(async () => {
            deployer = (await getNamedAccounts()).deployer
            fundMe = await ethers.getContract("FundMe", deployer)
        })

        it("allows people to fund and withdraw", async () => {
            await fundMe.fund({ value: sendValue })
            await fundMe.withdraw();

            const endingBalance = await ethers.provider.getBalance(fundMe.address)
            assert.equal(endingBalance.toString(), "0")
        })
    })