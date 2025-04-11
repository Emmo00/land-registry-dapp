import EthCrypto from "eth-crypto";

export async function decryptWithPrivateKey(encryptedFile: string, privateKey: string) {
    const decompressedFile = EthCrypto.cipher.parse(encryptedFile);

    return await EthCrypto.decryptWithPrivateKey(privateKey, decompressedFile);
}

async function encryptWithAdminPublicKey(message: string, publicKey: string): Promise<string> {
    const encryptedObject = await EthCrypto.encryptWithPublicKey(publicKey, message)
    return EthCrypto.cipher.stringify(encryptedObject)
}

export async function encryptFileWithPublicKey(file: File, fileContent: string, publicKey: string) {
    const fileObj = {
        name: file.name,
        type: file.type,
        content: fileContent,
    }

    const encryptedFileObj = encryptWithAdminPublicKey(JSON.stringify(fileObj), publicKey);

    return encryptedFileObj;
}