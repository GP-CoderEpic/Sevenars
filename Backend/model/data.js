import mongoose from 'mongoose';

const DataSchema = new mongoose.Schema({
  encrypted: String,
  hash: String,
  secretKeyFragments: String,
  fileType: String,
  blockchainData: Object, // Optional: depends on what uploadToBlockchain returns
});

export const Data = mongoose.model('/data', DataSchema);
