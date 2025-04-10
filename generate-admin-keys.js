const EthCrypto = require('eth-crypto')

const wallet = EthCrypto.createIdentity();
console.log("Private Key:", wallet.privateKey);
console.log("Public Key:", wallet.publicKey); // This will be used in the smart contract
