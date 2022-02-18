const fs = require('fs');
const path = require('path');
const elysianDeployment = require('@elysianfinance/elysian-contracts/deployed/ganache/deployment.json');

const {
    green,
    red,
    gray,
    yellow
} = require("chalk");

const PreElysianToken = artifacts.require("PreElysianToken");
const ExercisePLYS = artifacts.require("ExercisePLYS");
const Vault = artifacts.require("Vault");

const LYS = elysianDeployment.targets["ProxyElysian"].address;

const Treasury = elysianDeployment.targets["MyTreasury"].address;
const DAI = "0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3";

const deploymentFile = require("../deployment.json");

const saveBuild = (deployment) => {
    const dirName = `${__dirname}`.replace("\migrations", "");
    fs.writeFile(
        path.join(dirName, 
        'deployment.json'), 
        JSON.stringify(deployment, null, "\t"), 
        function (err) {
            if (err) {
                console.log(err);
            }
        }
    );
}

async function doDeploy(deployer, network, accounts) {

    let PreElysianTokenContract = await deployer.deploy(
        PreElysianToken, accounts[0]
    );

    console.log(`PreElysianToken deployed to: ${gray(PreElysianTokenContract.address)} on network: ${yellow(network)}`);

    let VaultContract = await deployer.deploy(
        Vault, accounts[0]
    );

    console.log(`Vault deployed to: ${gray(VaultContract.address)} on network: ${yellow(network)}`);

    let ExercisePLYSContract = await deployer.deploy(
        ExercisePLYS,
        PreElysianTokenContract.address, 
        LYS,
        DAI,
        VaultContract.address,
    );

    console.log(`ExercisePLYSContract deployed to: ${gray(ExercisePLYSContract.address)} on network: ${yellow(network)}`);

    const deployment = {
        PreElysianToken: PreElysianTokenContract.address,
        ExercisePLYS: ExercisePLYSContract.address,
        Vault: VaultContract.address
    }

    deploymentFile.networks[network] = deployment;
    console.log(deploymentFile);
    saveBuild(deploymentFile);
     
}

module.exports = (deployer, network, accounts) => {
    deployer.then(async () => {
         
        await doDeploy(deployer, network, accounts);

    });
};