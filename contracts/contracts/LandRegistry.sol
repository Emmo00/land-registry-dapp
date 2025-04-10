// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {Counter} from "./Counter.sol";

contract LandRegistry is Ownable, ReentrancyGuard {
    using ECDSA for bytes32;
    Counter private _landIdCounter;

    enum VerificationStatus {
        Pending,
        Approved,
        Rejected
    }

    struct LandRecord {
        uint256 id;
        string ownerFullName;
        string plotNumber;
        uint256 landSize; // acre * 100000 (10e5)
        string gpsCoordinates;
        string encryptedTitleDeedHash;
        VerificationStatus status;
        string rejectionReason;
        address owner;
        uint256 timestamp;
    }

    mapping(uint256 => LandRecord) public lands;
    mapping(address => uint256[]) public landIdsByOwner;
    mapping(string => uint256) private plotNumberToId;
    mapping(address => bool) public governmentOfficials;
    mapping(bytes32 => uint256) private proofToLandId;
    string public adminPublicKey;

    event LandRegistered(
        uint256 indexed id,
        string plotNumber,
        address indexed owner
    );
    event LandVerified(
        uint256 indexed id,
        string plotNumber,
        address indexed official
    );
    event LandRejected(
        uint256 indexed id,
        string plotNumber,
        string reason,
        address indexed official
    );
    event ProofGenerated(
        uint256 indexed id,
        bytes32 proofHash,
        address indexed owner
    );
    event ProofUsed(
        uint256 indexed id,
        bytes32 proofHash,
        address indexed verifier
    );
    event AdminPublicKeyUpdated(string indexed newAdminPublicKey);
    event OfficialAdded(address indexed official);
    event OfficialRemoved(address indexed official);

    modifier onlyOfficial() {
        require(
            governmentOfficials[msg.sender],
            "Not an authorized government official"
        );
        _;
    }

    modifier onlyLandOwner(uint256 _landId) {
        require(lands[_landId].owner == msg.sender, "Not the landowner");
        _;
    }

    constructor(string memory _adminPublicKey) Ownable(msg.sender) {
        adminPublicKey = _adminPublicKey; // Set the admin public key
        _landIdCounter = new Counter(); // Initialize the counter
        _landIdCounter.increment(); // Start the counter at 1
        governmentOfficials[msg.sender] = true; // Add the contract deployer as an official
    }

    function setAdminPublicKey(
        string memory _adminPublicKey
    ) external onlyOwner {
        adminPublicKey = _adminPublicKey;
        emit AdminPublicKeyUpdated(_adminPublicKey);
    }

    function addOfficial(address _official) external onlyOwner {
        governmentOfficials[_official] = true;
        emit OfficialAdded(_official);
    }

    function removeOfficial(address _official) external onlyOwner {
        governmentOfficials[_official] = false;
        emit OfficialRemoved(_official);
    }

    function registerLand(
        string memory _plotNumber,
        uint256 _landSize,
        string memory _gpsCoordinates,
        string memory _encryptedTitleDeedHash,
        string memory _ownerFullName
    ) external nonReentrant {
        require(
            plotNumberToId[_plotNumber] == 0,
            "Plot number already registered"
        );

        _landIdCounter.increment();
        uint256 landId = _landIdCounter.current();

        lands[landId] = LandRecord({
            id: landId,
            plotNumber: _plotNumber,
            landSize: _landSize,
            gpsCoordinates: _gpsCoordinates,
            encryptedTitleDeedHash: _encryptedTitleDeedHash,
            status: VerificationStatus.Pending,
            rejectionReason: "",
            owner: msg.sender,
            ownerFullName: _ownerFullName,
            timestamp: block.timestamp
        });

        plotNumberToId[_plotNumber] = landId;
        landIdsByOwner[msg.sender].push(landId);

        emit LandRegistered(landId, _plotNumber, msg.sender);
    }

    function getLandsByOwner(
        address _owner
    ) external view returns (LandRecord[] memory) {
        uint256[] memory ownerLandIds = landIdsByOwner[_owner];

        // load land record details
        LandRecord[] memory ownerLands = new LandRecord[](ownerLandIds.length);
        for (uint256 i = 0; i < ownerLandIds.length; i++) {
            ownerLands[i] = lands[ownerLandIds[i]];
        }
        return ownerLands;
    }

    function getAllLands() external view returns (LandRecord[] memory) {
        uint256 totalLands = _landIdCounter.current();
        LandRecord[] memory allLands = new LandRecord[](totalLands);
        for (uint256 i = 1; i <= totalLands; i++) {
            allLands[i - 1] = lands[i];
        }
        return allLands;
    }

    function verifyLand(uint256 _landId) external onlyOfficial {
        require(
            lands[_landId].status == VerificationStatus.Pending,
            "Land record is not pending"
        );
        lands[_landId].status = VerificationStatus.Approved;
        emit LandVerified(_landId, lands[_landId].plotNumber, msg.sender);
    }

    function rejectLand(
        uint256 _landId,
        string memory _reason
    ) external onlyOfficial {
        require(
            lands[_landId].status == VerificationStatus.Pending,
            "Land record is not pending"
        );
        lands[_landId].status = VerificationStatus.Rejected;
        lands[_landId].rejectionReason = _reason;
        emit LandRejected(
            _landId,
            lands[_landId].plotNumber,
            _reason,
            msg.sender
        );
    }

    function generateProof(
        uint256 _landId
    ) external onlyLandOwner(_landId) returns (bytes32) {
        require(
            lands[_landId].status == VerificationStatus.Approved,
            "Land must be approved"
        );
        bytes32 proofHash = keccak256(
            abi.encodePacked(block.timestamp, _landId, msg.sender)
        );
        proofToLandId[proofHash] = _landId;
        emit ProofGenerated(_landId, proofHash, msg.sender);
        return proofHash;
    }

    function verifyProof(
        bytes32 _proofHash
    ) external returns (LandRecord memory) {
        uint256 landId = proofToLandId[_proofHash];
        require(landId != 0, "Invalid or already used proof");
        LandRecord memory land = lands[landId];

        delete proofToLandId[_proofHash]; // Invalidate proof after use
        emit ProofUsed(landId, _proofHash, msg.sender);

        return land;
    }

    function getLandById(
        uint256 _landId
    ) external view returns (LandRecord memory) {
        return lands[_landId];
    }
}
