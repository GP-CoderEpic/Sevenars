import { ethers } from "ethers";
import { encryptAES256, decryptAES256, generateSecretKey } from "../encryption/aes.js";
import { generateSHA256 } from "../hashing/sha.js";
import fs from "fs";

async function main() {
    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

    const contractABI = [
        "function uploadFile(string _fileHash, string _fileURL) public",
        "function viewFile(uint _fileId) public view returns (string , string)",
        "function grantAccess(uint _fileId, address _user) public",
        "function revokeAccess(uint _fileId, address _user) public",
        "function hasAccess(uint _fileId, address _user) public view returns (bool)",
        "function fileCount() public view returns (uint)"
    ];

    const secretKey = generateSecretKey();
    console.log("🔑 Secret Key:", secretKey);
    const FileText = "This is a secret file that needs to be encrypted and stored securely on the blockchain.";
    const encryptFile = encryptAES256(FileText, secretKey);
    console.log("🔒 Encrypted File:", encryptFile);
    const FileHash = generateSHA256(encryptFile);
    console.log("📜 File Hash:", FileHash);

    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
    const privateKey = "0xdf57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e";
    const wallet = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(contractAddress, contractABI, wallet);

    // Upload a file
    const encryptedFileHash = FileHash;
    const fileStorageURL = "https://your-cloud-service.com/encrypted-file-1";

    const tx = await contract.uploadFile(encryptedFileHash, fileStorageURL);
    await tx.wait();
    console.log("📦Encrypted File uploaded!");
    const decryptFile = decryptAES256(encryptFile, secretKey);
    console.log("🔓 Decrypted File:", decryptFile);

    // Get file ID (latest one is fileCount - 1)
    const count = await contract.fileCount();
    const fileId = Number(count) - 1;

    // View file infoconst fileData = await contract.viewFile(fileId);
    // const fileData = await contract.viewFile(fileId);
    // console.log("Returned from viewFile:", fileData);
    const [fileHash, fileURL] = await contract.viewFile(fileId);
    console.log("📄 File Hash:", fileHash);
    console.log("📍 File URL:", fileURL);

    // Optionally: check access
    const hasAccess = await contract.hasAccess(fileId, wallet.address);
    console.log("🔐 Has access:", hasAccess);
}

main().catch((err) => {
    console.error("❌ Error:", err);
    process.exit(1);
});
