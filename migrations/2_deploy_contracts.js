const fs = require('fs');
const path = require('path');

const {
    green,
    red,
    gray,
    yellow
} = require("chalk");



const saveBuild = (deployment, network) => {
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
    fs.writeFile(
        `/data/code/BSC/Elysian/Frontend/src/deployed/${network}/pLYS/deployment.json`,
        JSON.stringify(deployment, null, "\t"), 
        function (err) {
            if (err) {
                console.log(err);
            }
        }
    );
}

async function doDeploy(deployer, network, accounts) {
    const elysianDeployment = require(`../../C-elysian-scaffold/deployed/${network}/deployment.json`);

    const PreElysianToken = artifacts.require("PreElysianToken");
    const ExercisePLYS = artifacts.require("ExercisePLYS");
    const Vault = artifacts.require("Vault");
    
    const LYS = elysianDeployment.targets["ProxyElysian"].address;
    
    const Treasury = elysianDeployment.targets["MyTreasury"].address;
    const DAI = "0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3";
    
    const deploymentFile = require("../deployment.json");

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
    saveBuild(deploymentFile, network);
     
}

module.exports = (deployer, network, accounts) => {
    if ( network === 'tests' ) { 
        return 
    } 
    deployer.then(async () => {
         
        await doDeploy(deployer, network, accounts);

    });
};