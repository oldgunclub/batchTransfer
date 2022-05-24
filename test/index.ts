import { expect } from "chai";
import { utils } from "ethers";
import { ethers } from "hardhat";

describe("Greeter", function () {
  this.beforeAll(async function () {
    const BatchTransfer = await ethers.getContractFactory("BatchTransfer");
    const TestToken = await ethers.getContractFactory("TestToken");
    this.batchTransfer = await BatchTransfer.deploy();
    this.testToken = await TestToken.deploy(1_000_000);

    await this.batchTransfer.deployed();
    await this.testToken.deployed();
  });
  it("Shoul be equal after trasfer batch ", async function () {
    const accounts = await ethers.getSigners();
    const owner = accounts[0];
    const reciepts = accounts.slice(1, 10);
    const _1ETH = utils.parseEther("1");
    const addr1Balance = await reciepts[1].getBalance();
    const addr9Balance = await reciepts[reciepts.length - 1].getBalance();

    const recieptsAddress = reciepts.map((reciept) => reciept.address);
    await this.batchTransfer.batchTansferETH(recieptsAddress, _1ETH, {
      value: _1ETH.mul(reciepts.length),
    });

    // wait until the transaction is mined

    // expect(await owner.getBalance()).to.equal(
    //   ownBalanace.sub(utils.parseEther("1"))
    // );
    expect(await reciepts[1].getBalance()).to.equal(
      addr1Balance.add(utils.parseEther("1"))
    );
    expect(await reciepts[reciepts.length - 1].getBalance()).to.equal(
      addr9Balance.add(utils.parseEther("1"))
    );
  });
  it("should be equal after transfer ERC20", async function () {
    const tokenAddress = this.testToken.address;

    const accounts = await ethers.getSigners();
    const owner = accounts[0];
    const reciepts = accounts.slice(1, 10);
    const _1ETH = utils.parseEther("1");
    const addr1Balance = await this.testToken.balanceOf(reciepts[1].address);
    const ownderBalance = await this.testToken.balanceOf(owner.address);
    const recieptsAddress = reciepts.map((reciept) => reciept.address);

    expect(ownderBalance).to.equal(await this.testToken.totalSupply());

    await this.testToken.approve(this.batchTransfer.address, 1000);

    await this.batchTransfer.batchTransferERC20(
      recieptsAddress,
      tokenAddress,
      2
    );

    expect(await this.testToken.balanceOf(reciepts[1].address)).to.equal(
      addr1Balance.add(2)
    );
    expect(await this.testToken.balanceOf(owner.address)).to.not.eq(
      ownderBalance.sub(5)
    );
  });
});
