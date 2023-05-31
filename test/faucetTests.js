const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { expect, assert } = require('chai');
const { ethers } = require('hardhat');

describe('Faucet', function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployContractAndSetVariables() {
    const Faucet = await ethers.getContractFactory('Faucet');
    const faucet = await Faucet.deploy({value: 10000000000000});

    const [owner] = await ethers.getSigners();

    return { faucet, owner };
  }

  it('should deploy and set the owner correctly', async function () {
    const { faucet, owner } = await loadFixture(deployContractAndSetVariables);

    expect(await faucet.owner()).to.equal(owner.address);
  });

  it('should not allow withdrawals above .1 ETH at a time', async function () {
    const { faucet } = await loadFixture(
      deployContractAndSetVariables
    );
    let withdrawAmount = ethers.utils.parseUnits('1', 'ether');
    await expect(faucet.withdraw(withdrawAmount)).to.be.reverted;
  });

  it('should allow withdrawals below .1 ETH at a time', async function () {
    const { faucet } = await loadFixture(
      deployContractAndSetVariables
    );
    let withdrawAmount = ethers.utils.parseUnits("121.0", "gwei");
    await expect(faucet.withdraw(withdrawAmount)).not.to.be.reverted;
  });

  it('should allow withdrawal all', async function () {
    const { faucet, owner } = await loadFixture(
      deployContractAndSetVariables
    );
    await faucet.withdrawAll();
    let balanceFaucet = await ethers.provider.getBalance(faucet.address);
    let balanceOwner = await ethers.provider.getBalance(owner.address);
    assert.equal(balanceFaucet, 0);
    assert.equal(balanceOwner, 9999999276842911351208);
  });

  it('should destroy the contract', async () => {
    const { faucet } = await loadFixture(
      deployContractAndSetVariables
    );
    await faucet.destroyFaucet();
    const bytecode = await ethers.provider.getCode(faucet.address);
    assert.equal(bytecode, "0x");
  });
});