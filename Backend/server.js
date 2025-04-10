// backend/server.js
import express from 'express';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { encryptAES256, decryptAES256, generateSecretKey } from "./encryption/aes.js";
import { createCipheriv, randomBytes } from 'crypto';
import { generateSHA256 } from "./hashing/sha.js";
import { uploadToBlockchain } from './scripts/interact.js';
import mongoose from 'mongoose';
const algorithm = 'aes-256-cbc';
const iv = randomBytes(16);

const app = express();
const PORT = 3000;

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve public folder as static
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

mongoose
    .connect("mongodb://localhost:27017/blockchain")
    .then((e) => console.log("MongoDB connectet"));

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


app.post('/hash', upload.single('file'), async (req, res) => {
  const file = req.file;
  const text = req.body.text;

  const secretKey = generateSecretKey();

  try {
    // Simulated cloud URL — replace this with your own upload service (like IPFS, AWS, etc.)
    const fileStorageURL = "https://your-cloud-service.com/encrypted-file";

    // ✅ Encrypt FILE
    if (file) {
      const fileContent = file.buffer.toString('utf-8');
      const encrypted = encryptAES256(fileContent, secretKey);
      
      const hash = generateSHA256(encrypted);

      // ⛓ Upload hash + URL to blockchain
      const blockchainResult = await uploadToBlockchain(hash, fileStorageURL);

      return res.json({
        type: 'file',
        hash,
        secretKey,
        ...blockchainResult,
        message: '✅ File encrypted and uploaded to blockchain.'
      });
    }

    // ✅ Encrypt TEXT
    if (text) {
      const encrypted = encryptAES256(text, secretKey);
      const hash = generateSHA256(encrypted);
      console.log("Encrypted File Content:", encrypted);

      // ⛓ Upload hash + URL to blockchain
      const blockchainResult = await uploadToBlockchain(hash, fileStorageURL);

      return res.json({
        type: 'text',
        hash,
        secretKey,
        ...blockchainResult,
        message: '✅ Text hashed and uploaded to blockchain.'
      });
    }

    // ❌ No file or text provided
    return res.status(400).json({ message: "❌ Provide either a file or text to encrypt." });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "❌ Encryption or Blockchain Upload failed.", error: err.message });
  }
});

app.use(express.json());

app.post('/decrypt', (req, res) => {
  const { encrypted, secretKey } = req.body;

  if (!encrypted || !secretKey) {
    return res.status(400).json({ message: "❌ Missing encrypted text or secret key" });
  }

  try {
    const decrypted = decryptAES256(encrypted, secretKey);
    return res.json({ decrypted });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "❌ Decryption failed", error: err.message });
  }
});

// Optional API route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});
