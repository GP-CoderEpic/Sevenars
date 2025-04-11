# Blockchain Encryption Vault

## Overview

The **Blockchain Encryption Vault** is a secure and interactive platform that demonstrates blockchain-based encryption techniques. This project is designed to educate users on cryptographic security while providing an intuitive and modern user experience.

### Tech Stack

- **Frontend:** HTML, CSS, JavaScript, Vite, ESLint
- **Backend:** Node.js, Express.js, Hardhat, Blockchain APIs
- **Blockchain:** Smart Contracts, Cryptographic Hashing
- **Tools & Frameworks:** Vite, Hardhat, Web3.js, IPFS (for decentralized storage)

## Features

- **Sleek Landing Page** – A visually appealing homepage with easy navigation.
- **Interactive Encryption Demo** – Users can encrypt and decrypt messages using blockchain technology.
- **Wallet Integration** – Users can connect their blockchain wallets for secure interactions.
- **User Authentication** – Secure login and retrieval of encrypted data.
- **Light/Dark Mode Toggle** – A theme toggle for improved user experience.
- **Modern UI/UX** – Designed with deep navy blues, electric cyan, accent purples, and crisp whites.
- **Smooth Animations** – Subtle transitions and interactive elements for better engagement.

## File Structure

```
📂 Blockchain-Encryption-Vault
├── 📂 Frontend         # Frontend source code
│   ├── 📂 public      # Static assets
│   ├── 📂 src         # Source files
│   ├── 📄 index.html  # Entry point
│   ├── 📄 vite.config.js  # Vite configuration
│   ├── 📄 package.json  # Dependencies
│   ├── 📄 README.md  # Project documentation
│   ├── 📄 eslint.config.js  # Linter configuration
│   ├── 📄 .gitignore  # Git ignore file
├── 📂 Backend          # Backend source code
│   ├── 📂 contracts   # Smart contracts
│   ├── 📂 encryption  # Encryption logic
│   ├── 📂 hashing     # Hashing algorithms
│   ├── 📂 service     # Backend services
│   ├── 📄 server.js   # Backend entry point
│   ├── 📄 hardhat.config.cjs  # Hardhat configuration
│   ├── 📄 package.json  # Dependencies
│   ├── 📄 .gitignore  # Git ignore file
```

## Setup Instructions

1. **Clone the Repository**

   ```bash
   git clone https://github.com/yourusername/blockchain-encryption-vault.git
   cd blockchain-encryption-vault
   ```

2. **Setup Frontend**
   ```bash
   cd Frontend
   npm install
   npm run dev
   ```
   Open `http://localhost:5173/` in a browser.

3. **Setup Backend**
   ```bash
   cd Backend
   npm install
   node server.js
   ```
   The backend runs on `http://localhost:3000/`.

## Visuals

### Landing Page
A modern and sleek interface with a dark/light mode toggle and smooth animations.

### Encryption Demo
An interactive section where users can encrypt and decrypt messages using blockchain technology.

### Wallet Integration
Users can securely connect their blockchain wallets for authentication and encryption processes.

### Dashboard
A user-friendly dashboard displaying encrypted data, transaction history, and encryption keys.

## Future Enhancements

- **Smart Contract Integration** for advanced security features.
- **Decentralized Storage** for encrypted files.
- **Multi-User Collaboration** for encrypted data sharing.

## Contributing

Feel free to fork this repository and submit pull requests with improvements.
