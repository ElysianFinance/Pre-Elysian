const HDWalletProvider = require("@truffle/hdwallet-provider");

const P_NULL = "0x0000000000000000000000000000000000000000000000000000000000000001"

//load single private key as string
const privateKeys = [
  process.env.PRIVATE_KEY_OWNER,
  process.env.PRIVATE_KEY_1,
  //process.env.PRIVATE_KEY_2,
  //process.env.PRIVATE_KEY_3
];

//const provider_mainnet =  new HDWalletProvider(privateKeys[0] || P_NULL, process.env.PROVIDER_URL_MAINNET);
const provider_ganache =  new HDWalletProvider(privateKeys || P_NULL, "http://localhost:8545");
//const provider_testnet =  new HDWalletProvider(privateKeys[2] || P_NULL, 'https://data-seed-prebsc-2-s3.binance.org:8545');


module.exports = {

  networks: {
    /*mainnet: {
      gas: 6721975,
      gasPrice:20000000000, 
      provider:provider_ganache,
      network_id: 56
    },*/
    ganache: {
      gas: 6721975,
      gasPrice:20000000000, 
      host: "127.0.0.1",     // Localhost
      port: 8545,            // Standard Ganache UI port
      network_id: 56,
    },
    tests: {
      gas: 6721975,
      gasPrice:20000000000, 
      host: "127.0.0.1",     // Localhost
      port: 8545,            // Standard Ganache UI port
      network_id: 56,
    },    
    /*  testnet: {
        gas: 15000000,
        gasPrice:5000000000, 
        provider:provider_testnet,
        network_id: 97
    },*/    
  },
  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
       version: "pragma",    // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      // settings: {          // See the solidity docs for advice about optimization and evmVersion
        optimizer: {
          enabled: true,
          runs: 200
        },
      //  evmVersion: "byzantium"
      // }
    }
  },

  // Truffle DB is currently disabled by default; to enable it, change enabled: false to enabled: true
  //
  // Note: if you migrated your contracts prior to enabling this field in your Truffle project and want
  // those previously migrated contracts available in the .db directory, you will need to run the following:
  // $ truffle migrate --reset --compile-all

  db: {
    enabled: false
  }
};
