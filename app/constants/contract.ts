import { Address } from "viem";

export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as Address;
export const CONTRACT_ABI = [
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_adminPublicKey",
                "type": "string"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "OwnableInvalidOwner",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "OwnableUnauthorizedAccount",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "ReentrancyGuardReentrantCall",
        "type": "error"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "string",
                "name": "newAdminPublicKey",
                "type": "string"
            }
        ],
        "name": "AdminPublicKeyUpdated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "plotNumber",
                "type": "string"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "LandRegistered",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "plotNumber",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "reason",
                "type": "string"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "official",
                "type": "address"
            }
        ],
        "name": "LandRejected",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "plotNumber",
                "type": "string"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "official",
                "type": "address"
            }
        ],
        "name": "LandVerified",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "official",
                "type": "address"
            }
        ],
        "name": "OfficialAdded",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "official",
                "type": "address"
            }
        ],
        "name": "OfficialRemoved",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "previousOwner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "bytes32",
                "name": "proofHash",
                "type": "bytes32"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "ProofGenerated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "bytes32",
                "name": "proofHash",
                "type": "bytes32"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "verifier",
                "type": "address"
            }
        ],
        "name": "ProofUsed",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_official",
                "type": "address"
            }
        ],
        "name": "addOfficial",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "adminPublicKey",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_landId",
                "type": "uint256"
            }
        ],
        "name": "generateProof",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getAllLands",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "ownerFullName",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "plotNumber",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "landSize",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "gpsCoordinates",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "encryptedTitleDeedHash",
                        "type": "string"
                    },
                    {
                        "internalType": "enum LandRegistry.VerificationStatus",
                        "name": "status",
                        "type": "uint8"
                    },
                    {
                        "internalType": "string",
                        "name": "rejectionReason",
                        "type": "string"
                    },
                    {
                        "internalType": "address",
                        "name": "owner",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "timestamp",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct LandRegistry.LandRecord[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_landId",
                "type": "uint256"
            }
        ],
        "name": "getLandById",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "ownerFullName",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "plotNumber",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "landSize",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "gpsCoordinates",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "encryptedTitleDeedHash",
                        "type": "string"
                    },
                    {
                        "internalType": "enum LandRegistry.VerificationStatus",
                        "name": "status",
                        "type": "uint8"
                    },
                    {
                        "internalType": "string",
                        "name": "rejectionReason",
                        "type": "string"
                    },
                    {
                        "internalType": "address",
                        "name": "owner",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "timestamp",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct LandRegistry.LandRecord",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_owner",
                "type": "address"
            }
        ],
        "name": "getLandsByOwner",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "ownerFullName",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "plotNumber",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "landSize",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "gpsCoordinates",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "encryptedTitleDeedHash",
                        "type": "string"
                    },
                    {
                        "internalType": "enum LandRegistry.VerificationStatus",
                        "name": "status",
                        "type": "uint8"
                    },
                    {
                        "internalType": "string",
                        "name": "rejectionReason",
                        "type": "string"
                    },
                    {
                        "internalType": "address",
                        "name": "owner",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "timestamp",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct LandRegistry.LandRecord[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "governmentOfficials",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "landIdsByOwner",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "lands",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "ownerFullName",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "plotNumber",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "landSize",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "gpsCoordinates",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "encryptedTitleDeedHash",
                "type": "string"
            },
            {
                "internalType": "enum LandRegistry.VerificationStatus",
                "name": "status",
                "type": "uint8"
            },
            {
                "internalType": "string",
                "name": "rejectionReason",
                "type": "string"
            },
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_plotNumber",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "_landSize",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "_gpsCoordinates",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_encryptedTitleDeedHash",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_ownerFullName",
                "type": "string"
            }
        ],
        "name": "registerLand",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_landId",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "_reason",
                "type": "string"
            }
        ],
        "name": "rejectLand",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_official",
                "type": "address"
            }
        ],
        "name": "removeOfficial",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_adminPublicKey",
                "type": "string"
            }
        ],
        "name": "setAdminPublicKey",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_landId",
                "type": "uint256"
            }
        ],
        "name": "verifyLand",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "_proofHash",
                "type": "bytes32"
            }
        ],
        "name": "verifyProof",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];
export const LAND_SIZE_DECIMALS = 5;