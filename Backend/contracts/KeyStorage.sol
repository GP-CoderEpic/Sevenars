// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract EncryptedFileVault {
    uint public fileCount;

    struct FileMeta {
        string fileHash;         // SHA-256 hash of encrypted file
        string fileURL;          // Link to encrypted file (IPFS/Cloud)
        address uploader;        // Owner of the file
        uint timestamp;          // When file was uploaded
    }

    mapping(uint => FileMeta) public files;
    mapping(uint => mapping(address => bool)) public accessControl; // fileId => (address => hasAccess)

    event FileUploaded(
        uint indexed fileId,
        address indexed uploader,
        string fileHash,
        string fileURL,
        uint timestamp
    );

    event FileAccessed(
        uint indexed fileId,
        address indexed accessor,
        uint timestamp
    );

    modifier onlyUploader(uint _fileId) {
        require(msg.sender == files[_fileId].uploader, "Not file owner");
        _;
    }

    function uploadFile(string memory _fileHash, string memory _fileURL) public {
        files[fileCount] = FileMeta(_fileHash, _fileURL, msg.sender, block.timestamp);

        // Give uploader access by default
        accessControl[fileCount][msg.sender] = true;

        emit FileUploaded(fileCount, msg.sender, _fileHash, _fileURL, block.timestamp);

        fileCount++;
    }

    function grantAccess(uint _fileId, address _user) public onlyUploader(_fileId) {
        accessControl[_fileId][_user] = true;
    }

    function revokeAccess(uint _fileId, address _user) public onlyUploader(_fileId) {
        accessControl[_fileId][_user] = false;
    }

    function viewFile(uint _fileId) public view returns (string memory fileHash, string memory fileURL) {
    require(accessControl[_fileId][msg.sender], "Access denied");

    FileMeta memory f = files[_fileId];
    return (f.fileHash, f.fileURL);
}


    function logAccess(uint _fileId) public {
    require(accessControl[_fileId][msg.sender], "Access denied");
    emit FileAccessed(_fileId, msg.sender, block.timestamp);
    }



    function hasAccess(uint _fileId, address _user) public view returns (bool) {
        return accessControl[_fileId][_user];
    }
}
