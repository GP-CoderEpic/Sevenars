import crypto from 'crypto';

/**
 * Encrypts a string using AES-256 encryption
 * @param {string} text - The text to encrypt
 * @param {string} secretKey - The secret key for encryption (must be 32 bytes for AES-256)
 * @returns {string} The encrypted text as a hexadecimal string
 */
function encryptAES256(text, secretKey) {
  // Generate a random initialization vector
  const iv = crypto.randomBytes(16);
  
  // Create cipher using AES-256-CBC with the secret key and initialization vector
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secretKey), iv);
  
  // Encrypt the text
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  // Return the IV and encrypted data
  return iv.toString('hex') + ':' + encrypted;
}

/**
 * Decrypts AES-256 encrypted text
 * @param {string} encryptedText - The encrypted text (format: iv:encryptedData)
 * @param {string} secretKey - The secret key used for encryption
 * @returns {string} The decrypted text
 */
function decryptAES256(encryptedText, secretKey) {
  // Split the encrypted text to get the IV and actual encrypted data
  const parts = encryptedText.split(':');
  const iv = Buffer.from(parts[0], 'hex');
  const encryptedData = parts[1];
  
  // Create decipher using the same key and IV
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(secretKey), iv);
  
  // Decrypt the data
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

function generateSecretKey(){
  return crypto.randomBytes(32).toString('hex').slice(0, 32);
}

// Example usage
// const message = "Hello, blockchain!";
// // Secret key must be exactly 32 bytes (256 bits) for AES-256
// const secretKey = crypto.randomBytes(32).toString('hex').slice(0, 32);

// const encrypted = encryptAES256(message, secretKey);
// const decrypted = decryptAES256(encrypted, secretKey);

// console.log(`Original Message: ${message}`);
// console.log(`Secret Key: ${secretKey}`);
// console.log(`Encrypted (AES-256): ${encrypted}`);
// console.log(`Decrypted: ${decrypted}`);

export  { encryptAES256, decryptAES256, generateSecretKey };