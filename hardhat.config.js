require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require('hardhat-abi-exporter');

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
/*
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});
*/
module.exports = {
    solidity: "0.8.12",
    settings: {
    optimizer: {
        enabled: false,
        runs: 200,
      },
    },
    networks: {
        opera:{
            url: 'https://rpc.ftm.tools/',
            chainId: 250,
            gasPrice: 'auto',
            gas: 'auto',
            timeout: 30000
        },
        local:{
          url: 'http://localhost:7545/',
          chainId: 1337,
          gasPrice: 20000000000,
          gas: 'auto',
          timeout: 20000,
          accounts: ['9d680a329cba647cc77fafd02024fcd76cb5ab01fc075a3c5d76e50c58c95c51']
        }
    },
    etherscan: {
        apiKey: "SVXH9NKYC61V2CHGDAGMANWWQU53V2MWUG"
    },
    abiExporter: {
  path: './data/abi',
  clear: true,
  flat: true,
  spacing: 2,
  pretty: true,
 }
}

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
