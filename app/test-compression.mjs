import EthCrypto from "eth-crypto"
const wallet = EthCrypto.createIdentity();
console.log("Private Key:", wallet.privateKey);
console.log("Public Key:", wallet.publicKey); // This will be used in the smart contract

const ADMIN_PUBLIC_KEY = "0x02d87ed3198f163dca431df921772a808ad8b29e3f391283abc8540cb0554a12d4"

const ADMIN_PRIVATE_KEY = "0x40aed8f46f428a76b45805303fa9bd3b357052c22dad11237bc7338ad5c6f32e"

const encrypted = await EthCrypto.encryptWithPublicKey(wallet.publicKey, "hi");

console.log(encrypted);

console.log(await EthCrypto.decryptWithPrivateKey(wallet.privateKey, encrypted))