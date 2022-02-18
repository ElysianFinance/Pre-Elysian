const { assert } = require('chai');
const { BN, constants, expectEvent, shouldFail } = require('openzeppelin-test-helpers');
const ExercisePLYS = artifacts.require("ExercisePLYS");
const w3utils = require('web3-utils');
const truffleAssert = require('truffle-assertions');

contract("ExercisePLYS", accounts => {
    
    const account_owner = accounts[0];
    const account_user1 = accounts[1];
    const account_user2 = accounts[2];

    it("Should be owned by first account", async () => {
        const instance = await ExercisePLYS.deployed();
        const owner = await instance.owner.call();
        assert.equal(owner, account_owner);
    })


    it("Should add vesting terms", async () => {
        const instance = await ExercisePLYS.deployed();
        const owner = await instance.owner.call();

        await truffleAssert.passes(
            instance.setTerms(
                account_owner, 
                w3utils.toWei(`${1e9}`),
                0,
                {from: account_owner}
            )
        );
        
    })


    it("Should exercise pLYS succesfully", async () => {
        const instance = await ExercisePLYS.deployed();
        const owner = await instance.owner.call();

        await truffleAssert.passes(
            instance.exercisePLYS(
                w3utils.toWei(`${10}`),
                {from: account_owner}
            )
        );
        
    })


    

});
