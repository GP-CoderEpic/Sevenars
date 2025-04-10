import hardhat from "hardhat";
const { ethers } = hardhat;

async function main() {
    // Get contract factory
    const EncryptedFileVault = await ethers.getContractFactory("EncryptedFileVault");

    // Deploy contract
    const vault = await EncryptedFileVault.deploy();

    // Wait for deployment to complete
    await vault.waitForDeployment();  // Important for Ethers v6+

    // Output the deployed contract address
    console.log(`EncryptedFileVault deployed at: ${await vault.getAddress()}`);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
