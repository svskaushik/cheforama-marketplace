require("@nomiclabs/hardhat-waffle");
require('dotenv').config();
const projectId = process.env.ALCHEMY_API_KEY
const privateKey = process.env.KEY


module.exports = {
  networks: {
    hardhat: {
      chainId: 1337,
    },
    mumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${projectId}`,
      accounts: [privateKey]
    }
  },
  solidity: "0.8.4",
};
