require("@nomiclabs/hardhat-waffle");
require('dotenv').config();
const projectId = process.env.API_KEY
const privateKey = process.env.KEY


module.exports = {
  networks: {
    hardhat: {
      chainId: 1337,
    },
    bsctestnet: {
      url: `https://bsc.getblock.io/testnet/?api_key=${projectId}`,
      accounts: [privateKey]
    }
  },
  solidity: "0.8.4",
};
