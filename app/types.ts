import { Address } from "viem";

export type LandRecordType = {
    id: bigint;
    ownerFullName: string;
    plotNumber: string;
    landSize: bigint;
    gpsCoordinates: string;
    encryptedTitleDeedHash: string;
    rejectionReason: string;
    owner: string;
    status: number;
    timestamp: bigint;
}

export type FileDecrypted = {
    name: string;
    type: string;
    content: string;
}

export type ProofGeneratedLog = {
    args: {
        id: bigint;
        owner: Address;
        proofHash: string;
    }
}