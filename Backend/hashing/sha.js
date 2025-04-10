import crypto from 'crypto';

/**
 * Generates a SHA-256 hash of the input string
 * @param {string} input - The string to hash
 * @returns {string} The SHA-256 hash as a hexadecimal string
 */
function generateSHA256(input) {
  // Create a hash object using the SHA-256 algorithm
  const hash = crypto.createHash('sha-256');
  
  // Update the hash object with the input string
  hash.update(input);
  
  // Generate and return the hash digest in hexadecimal format
  return hash.digest('hex');
}

// // Example usage
// const message = "Hello, blockchain!";
// const hash = generateSHA256(message);

// console.log(`Message: ${message}`);
// console.log(`SHA-256 Hash: ${hash}`);
export  { generateSHA256 };