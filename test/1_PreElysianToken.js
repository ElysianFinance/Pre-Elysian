const { assert } = require('chai');
const { BN, constants, expectEvent, shouldFail } = require('openzeppelin-test-helpers');
const PreElysianToken = artifacts.require("PreElysianToken");
const w3utils = require('web3-utils');
const truffleAssert = require('truffle-assertions');

contract("PreElysianToken", accounts => {

    const account_owner = accounts[0];
    const account_user1 = accounts[1];
    const account_user2 = accounts[2];
 
    it("Should be owned by first account", async () => {
        const instance = await PreElysianToken.deployed();
        const owner = await instance.owner.call();
        assert.equal(owner, account_owner);
    })

    it("Should disable minting", async () => {
        const instance = await PreElysianToken.deployed();
        const { logs } = await instance.disableMinting({
            from: account_owner
        })
        expectEvent.inLogs(logs, "MintingDisabled", {
            operator: account_owner,
        });
    })

    it("should not mint", async () => {
        const instance = await PreElysianToken.deployed();
        await truffleAssert.reverts(instance.mint(accounts[0], w3utils.toWei("1000000000"), {
            from: account_owner
        }), "Minting has been disabled");
    })

    it("should find 1,000,000,000 PreElysianToken in the owner account", async () => {
        const instance = await PreElysianToken.deployed();
        const balance = await instance.balanceOf.call(account_owner);
        assert.equal(w3utils.fromWei(balance), 1000000000);
    });

    it("Shouldn not disable minting", async () => {
        const instance = await PreElysianToken.deployed();

        await truffleAssert.reverts(instance.disableMinting({
            from: account_user2
        }), "Only the contract owner may perform this action");

    })

    it("Should enable minting", async () => {
        const instance = await PreElysianToken.deployed();
        const { logs } = await instance.enableMinting({
            from: account_owner
        })
        expectEvent.inLogs(logs, "MintingEnabled", {
            operator: account_owner,
        });
    })

    it("should mint PreElysianToken to the first account", async () => {
        const instance = await PreElysianToken.deployed();

        await instance.mint(account_owner, w3utils.toWei("100000"));
    })
 
    it("should burn PreElysianToken for the first account", async () => {
        const instance = await PreElysianToken.deployed();

        await instance.burn(w3utils.toWei("100"));
    })

    it("should transfer from owner account", async () => {
        const instance = await PreElysianToken.deployed();
        await truffleAssert.passes(
            instance.transfer(
                account_user1, 
                w3utils.toWei("100"), 
                {from: account_owner}
            )
        );
    })
    
    it("should not transfer from non owner account", async () => {
        const instance = await PreElysianToken.deployed();
         
        await truffleAssert.reverts(
            instance.transfer(
                account_owner, 
                w3utils.toWei("1"), 
                {from: accounts[1]}
            ), "Account not approved to transfer pLYS"
        );
    })
})