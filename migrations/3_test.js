const w3utils = require('web3-utils');

const PreElysianToken = artifacts.require("PreElysianToken");
const contractAddress = PreElysianToken.networks[56].address;

async function run(network, accounts) {

    const contract = await PreElysianToken.at(contractAddress);
    console.log(await contract.owner())

    console.log(accounts)
    try {
        console.log(await contract.disableMinting({from: accounts[0]}))
        console.log(await contract.enableMinting({from: accounts[0]}))

        console.log(await contract.transfer(accounts[2], w3utils.toWei(`${1}`), {from: accounts[0]}))
        console.log(await contract.transfer(accounts[1], w3utils.toWei(`${1}`), {from: accounts[3]}))

    } catch (err){
        console.log(err)
    }

}

module.exports = (deployer, network, accounts) => {
    deployer.then(async () => {
        await run(network, accounts);
    });
};