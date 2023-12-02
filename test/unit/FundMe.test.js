const { deployments, getNamedAccounts, ethers } = require("hardhat")
const { assert, expect } = require("chai");

!developmentChains.includes(network.name) ? describe.skip :
    describe("FundMe", async () => {

        let fundMe;
        let deployer;
        let mockV3Aggregator;
        const sendValue = await ethers.utils.parseEthers("1")
        beforeEach(async () => {
            deployer = (await getNamedAccounts()).deployer
            await deployments.fixture(["all"]);
            fundMe = await ethers.getContract("FundMe", deployer)
            mockV3Aggregator = await ethers.getContract("MockV3Aggregator", deployer)
        });

        describe("Deployment", async () => {
            it("sets correct aggregator address", async () => {
                const txresponse = await fundMe.dataFeed();
                assert.equal(txresponse, mockV3Aggregator.address);
            });
        });

        describe("fund", async () => {
            it("fails if you don't send enough eth", async () => {
                await expect(fundMe.fund()).to.be.revertedWith("You need to spend more eth")
            })

            it("updates the amount funded mapping", async () => {
                await fundMe.fund({ value: sendValue })
                const txresponse = await fundMe.addressToAmountFunded[deployer.address]
                assert.equal(txresponse.toString(), sendValue.toString())
            });

            it("adds funders to array of funders", async () => {
                await fundMe.fund({ value: sendValue })
                const funder = await fundMe.Funders(0);
                assert.equal(funder, deployer)
            })
        });

        describe("withdraw", async () => {
            beforeEach(async () => {
                await fundMe.fund({ value: sendValue })
            })
            it("can withdraw eth from a single funder", async () => {
                // ....................starting balance........................

                const startingfundMeBalance = await ethers.provider.getBalance(fundMe.address)
                const startingdeployerBalance = await ethers.provider.getBalance(deployer)
                // ....................tx........................

                const txresponse = await fundMe.withdraw();
                const txreceipt = await txresponse.wait(1);
                // ....................gas........................

                const { gasUsed, effectiveGasPrice } = txreceipt
                const gasCost = gasUsed.mul(effectiveGasPrice)
                // ....................ending balance........................

                const endingfundMeBalance = await ethers.provider.getBalance(fundMe.address)
                const endingdeployerBalance = await ethers.provider.getBalance(deployer.address)
                // ....................assertions........................

                assert.equal(endingfundMeBalance, 0)
                assert.equal(startingfundMeBalance.add(startingdeployerBalance).toString(), endingdeployerBalance.add(gasCost).toString())
            })

            it("allows us to withdraw with multiple funders", async () => {
                const accounts = await ethers.getSigners();
                for (let i = 1; i < 6; i++) {
                    const fundMeConnectedAccounts = await fundMe.connect(accounts[i]);
                    await fundMeConnectedAccounts.fund({ value: sendValue });
                }

                // ....................starting balance........................

                const startingfundMeBalance = await ethers.provider.getBalance(fundMe.address)
                const startingdeployerBalance = await ethers.provider.getBalance(deployer)

                // ....................tx........................

                const txresponse = await fundMe.withdraw();
                const txreceipt = await txresponse.wait(1);
                // ....................gas........................

                const { gasUsed, effectiveGasPrice } = txreceipt
                const gasCost = gasUsed.mul(effectiveGasPrice)
                // ....................assertions........................

                assert.equal(endingfundMeBalance, 0)
                assert.equal(startingfundMeBalance.add(startingdeployerBalance).toString(), endingdeployerBalance.add(gasCost).toString())

                await expect(fundMe.Funders(0)).to.be.reverted

                for (let i = 1; i < 6; i++) {
                    assert.equal(await fundMe.addressToAmountFunded[accounts[i]].address, 0)
                }
            })

            it("only allows owner to withdraw", async () => {
                const accounts = await ethers.getSigners();
                const attacker = accounts[1]
                const attackerConnectedAccount = await fundMe.connect(attacker);
                await expect(attackerConnectedAccount.withdraw()).to.be.revertedWith("FundMe__NotOwner")
            });
        })
    })