import mongoose from "mongoose";

const { Schema } = mongoose;

const TransactionRecordSchema = new Schema({
  operation: { 
    type: String, 
    required: true,
    enum: ["CREATE_NOTE", "UPDATE_NOTE", "DELETE_NOTE"]
  },
  txHash: { 
    type: String, 
    required: true,
    match: /^[a-f0-9]{64}$/i // Validate tx hash format
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  }
});

const NoteSchema = new Schema({
  noteId: { 
    type: String, 
    required: true, 
    unique: true,
    index: true // Add index for faster queries
  },
  walletAddress: {
    type: String,
    required: true,
    index: true // Add index for wallet-based queries
  },
  title: {
    type: String,
    default: "Untitled",
    maxlength: 200
  },
  content: {
    type: String,
    default: ""
  },
  archived: { 
    type: Boolean, 
    default: false,
    index: true // Add index for filtering
  },
  // Local-only features (not on blockchain)
  pinned: {
    type: Boolean,
    default: false
  },
  starred: {
    type: Boolean,
    default: false
  },
  tags: {
    type: [String],
    default: []
  },
  color: {
    type: String,
    default: null
  },
  // Blockchain transaction history
  transactionHistory: { 
    type: [TransactionRecordSchema], 
    default: [] 
  },
  createdAt: { 
    type: Date, 
    default: Date.now,
    index: true // Add index for sorting
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Add compound index for common queries
NoteSchema.index({ walletAddress: 1, archived: 1, createdAt: -1 });

// Middleware to update updatedAt on save
NoteSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Note = mongoose.model("Note", NoteSchema);

export default Note;