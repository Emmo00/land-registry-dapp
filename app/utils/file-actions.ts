import { encryptFileWithPublicKey } from "./crypto";

// Helper to upload content to IPFS.
export async function uploadToIPFS(file: File): Promise<string> {
    const formData = new FormData();

    formData.set('file', file);

    const uploadRequest = await fetch("/api/files", {
        method: "POST",
        body: formData,
    });
    const cid = await uploadRequest.json();

    console.log("file cid", cid);

    return cid;
}

// Process file: read it, encrypt with admin public key and upload to IPFS.
export async function processFileEncryptionAndUpload(file: File, ADMIN_PUBLIC_KEY: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = async () => {
            try {
                // Read file content as text (or you can convert to base64 if needed).
                const fileContent = reader.result as ArrayBuffer
                const base64EncodedFile = Buffer.from(fileContent).toString('base64');
                // Encrypt content.
                const encrypted = await encryptFileWithPublicKey(file, base64EncodedFile, ADMIN_PUBLIC_KEY);
                // Upload encrypted content to IPFS.
                const cid = await uploadToIPFS(new File([encrypted], `${file.name}.txt`, { type: "text/plain" }));
                resolve(cid)
            } catch (error) {
                reject(error)
            }
        }
        reader.onerror = reject
        reader.readAsArrayBuffer(file)

    })
}