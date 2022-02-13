const fs = require('fs');
const path = require('path');

const PreElysianToken = artifacts.require("PreElysianToken");
const ExercisePLYS = artifacts.require("ExercisePLYS");

const LYS = "0x9EBB9D9d463fD0D5CFD6C68f7a517C8C781B4099";
const DAI = "0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3";
const Treasury = "0xEC9b75D89C48EbFc274aa93Ce0F7C59a12Aa5eB2";

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

    console.log(`PreElysianToken deployed to: ${PreElysianTokenContract.address} on network: ${network}`);

    let ExercisePLYSContract = await deployer.deploy(
        ExercisePLYS,
        PreElysianTokenContract.address, 
        LYS,
        DAI,
        Treasury,
    );

    console.log(`ExercisePLYSContract deployed to: ${ExercisePLYSContract.address} on network: ${network}`);

    const deployment = {
        PreElysianToken: PreElysianTokenContract.address,
        ExercisePLYS: ExercisePLYSContract.address
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