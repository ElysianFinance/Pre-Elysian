
const PreElysianToken = artifacts.require("PreElysianToken");

async function doDeploy(deployer, network, accounts) {

    let deployedContract = await deployer.deploy(
        PreElysianToken, accounts[0]
    );

    console.log(`PreElysianToken deployed to: ${deployedContract.address} on network: ${network}`);

}

module.exports = (deployer, network, accounts) => {
    deployer.then(async () => {
         
        await doDeploy(deployer, network, accounts);

    });
};