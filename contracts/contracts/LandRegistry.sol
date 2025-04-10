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
        bytes32 hashedNIN;
        string plotNumber;
        uint256 landSize; // acre * 100000 (10e5)
        string gpsCoordinates;
        string witnessFullName;
        bytes32 witnessHashedNIN;
        string encryptedTitleDeedHash;
        VerificationStatus status;
        string rejectionReason;
        address owner;
    }

    mapping(uint256 => LandRecord) public lands;
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
    event OfficialLoggedIn(address indexed official);
    event OfficialLoggedOut(address indexed official);

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
        adminPublicKey = _adminPublicKey;
    }

    function setAdminPublicKey(
        string memory _adminPublicKey
    ) external onlyOwner {
        adminPublicKey = _adminPublicKey;
        emit AdminPublicKeyUpdated(_adminPublicKey);
    }

    function loginOfficial(
        bytes32 _messageHash,
        bytes memory _signature
    ) external {
        require(
            keccak256(bytes(adminPublicKey)) != keccak256(""),
            "Admin public key not set"
        );
        require(
            _messageHash.recover(_signature) == address(uint160(uint256(keccak256(abi.encodePacked(adminPublicKey))))),
            "Invalid signature"
        );
        governmentOfficials[msg.sender] = true;
        emit OfficialLoggedIn(msg.sender);
    }

    function logoutOfficial() external {
        require(governmentOfficials[msg.sender], "Not logged in");
        governmentOfficials[msg.sender] = false;
        emit OfficialLoggedOut(msg.sender);
    }

    function registerLand(
        string memory _plotNumber,
        uint256 _landSize,
        string memory _gpsCoordinates,
        bytes32 _hashedNIN,
        bytes32 _witnessHashedNIN,
        string memory _encryptedTitleDeedHash,
        string memory _ownerFullName,
        string memory _witnessFullName
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
            hashedNIN: _hashedNIN,
            witnessHashedNIN: _witnessHashedNIN,
            encryptedTitleDeedHash: _encryptedTitleDeedHash,
            status: VerificationStatus.Pending,
            rejectionReason: "",
            owner: msg.sender,
            ownerFullName: _ownerFullName,
            witnessFullName: _witnessFullName
        });

        plotNumberToId[_plotNumber] = landId;

        emit LandRegistered(landId, _plotNumber, msg.sender);
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
    )
        external
        returns (
            uint256 id,
            string memory plotNumber,
            uint256 landSize,
            string memory gpsCoordinates,
            string memory encryptedTitleDeedHash
        )
    {
        uint256 landId = proofToLandId[_proofHash];
        require(landId != 0, "Invalid or already used proof");
        LandRecord memory land = lands[landId];

        delete proofToLandId[_proofHash]; // Invalidate proof after use
        emit ProofUsed(landId, _proofHash, msg.sender);

        return (
            land.id,
            land.plotNumber,
            land.landSize,
            land.gpsCoordinates,
            land.encryptedTitleDeedHash
        );
    }

    function getLandByPlotNumber(
        string memory _plotNumber
    )
        external
        view
        returns (
            uint256 id,
            string memory plotNumber,
            uint256 landSize,
            string memory gpsCoordinates,
            VerificationStatus status,
            string memory rejectionReason,
            string memory encryptedTitleDeedHash
        )
    {
        uint256 landId = plotNumberToId[_plotNumber];
        require(landId != 0, "Land record not found");
        LandRecord memory land = lands[landId];
        return (
            land.id,
            land.plotNumber,
            land.landSize,
            land.gpsCoordinates,
            land.status,
            land.rejectionReason,
            land.encryptedTitleDeedHash
        );
    }
}
