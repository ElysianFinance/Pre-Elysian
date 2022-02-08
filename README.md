# Pre-Elysian token

This is the code for the Pre-Elysian token. See details on the [official Medium article](https://medium.com)


## Requirements
- Node v12 or higher
- Truffle 

## 1. Setup 

To setup and install dependencies please run:

```bash
# setup (install all dependencies)
npm install
```

## 2. Build
Will compile bytecode and ABIs for all .sol files found in node_modules and the contracts folder. It will output them in the build folder.

```bash
# build (compile all .sol sources)
node publish build 
```

## 3. Deploy

```bash
# deploy (deploy compiled .sol sources)
npm run deploy-ganache
```

## 4. Test

```bash
# test (run test suite)
npm run test-ganache
```


To deploy the code on multiple networks the truffle-config.js file needs to be adjusted, see instructions [here](https://trufflesuite.com/docs/truffle/reference/configuration#networks).

