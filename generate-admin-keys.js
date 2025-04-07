const { Wallet } = require("ethers");

const wallet = Wallet.createRandom();
console.log("Private Key:", wallet.privateKey);
console.log("Public Key:", wallet.address); // This will be used in the smart contract
