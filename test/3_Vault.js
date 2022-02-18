const { assert } = require('chai');
const { BN, constants, expectEvent, shouldFail } = require('openzeppelin-test-helpers');
const Vault = artifacts.require("Vault");
const w3utils = require('web3-utils');
const truffleAssert = require('truffle-assertions');
const deployment = require("../deployment.json");

contract("Vault", accounts => {

    const account_owner = accounts[0];
    const account_user1 = accounts[1];
    const account_user2 = accounts[2];

    it("Should be owned by first account", async () => {
        const instance = await Vault.deployed();
        const owner = await instance.owner.call();
        assert.equal(owner, account_owner);
        assert.notEqual(owner, account_user1);

    })

 
    it("Should fail adding reserves", async () => {
        const instance = await Vault.deployed();

        await truffleAssert.reverts(
            instance.depositReserves(
                w3utils.toWei(`${10}`),
                account_owner,
                {from: account_user1}
            ), "Not allowed to deposit"
        );
    })

    it("Should fail to authorize owner to deposit reserves from non-owner account", async () => {
        const instance = await Vault.deployed();
        const owner = await instance.owner.call();


        await truffleAssert.reverts(
            instance.setReserveDepositor(
                account_owner,
                {from: account_user1}
            ), "Only the contract owner may perform this action"
        );
    })


    it("Should authorize owner to deposit reserves", async () => {
        const instance = await Vault.deployed();

        await truffleAssert.passes(
            instance.setReserveDepositor(
                account_owner,
                {from: account_owner}
            )
        );
    })

    it("Should fail migrating funds from non-owner account", async () => {
        const instance = await Vault.deployed();

        await truffleAssert.reverts(
            instance.migrateReserves({from: account_user1}), "Only the contract owner may perform this action"
        );
    })

    it("Should succed migrating reserves", async () => {
        const instance = await Vault.deployed();

        await truffleAssert.passes(
            instance.migrateReserves({from: account_owner})
        );

        //truffleAssert.eventEmitted(tx, "Transfer", {
        //    from: deployment.networks["ganache"].Vault,
        //    to: account_owner
        //});
    })

});
