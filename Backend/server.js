// backend/server.js
import express from 'express';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { encryptAES256, decryptAES256, generateSecretKey } from "./encryption/aes.js";
import { createCipheriv, randomBytes } from 'crypto';
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

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });



app.post('/encrypt', upload.single('file'), (req, res) => {
  const file = req.file;
  const text = req.body.text;

  const secretKey = generateSecretKey();

  try {
    // Encrypt FILE
    if (file) {
      const fileContent = file.buffer.toString('utf-8');
      const encrypted = encryptAES256(fileContent, secretKey);
      return res.json({
        type: 'file',
        encrypted,
        secretKey,
        message: '✅ File encrypted successfully.'
      });
    }

    // Encrypt TEXT
    if (text) {
      const encrypted = encryptAES256(text, secretKey);
      return res.json({
        type: 'text',
        encrypted,
        secretKey,
        message: '✅ Text encrypted successfully.'
      });
    }

    // If neither file nor text
    return res.status(400).json({ message: "❌ Provide either a file or text to encrypt." });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "❌ Encryption failed.", error: err.message });
  }
});

// Optional API route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});
