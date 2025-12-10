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
    required: true
    // REMOVED strict regex - validation done in middleware instead
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "failed"],
    default: "pending"
  },
  confirmedAt: {
    type: Date
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
    index: true
  },
  walletAddress: {
    type: String,
    required: true,
    index: true
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
  
  // Overall note status (for background worker)
  status: {
    type: String,
    enum: ["pending", "confirmed", "failed"],
    default: "pending",
    index: true // Index for worker queries
  },
  
  archived: { 
    type: Boolean, 
    default: false,
    index: true
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
    index: true
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Compound indexes for common queries
NoteSchema.index({ walletAddress: 1, archived: 1, createdAt: -1 });
NoteSchema.index({ status: 1 }); // For background worker

// Middleware to update updatedAt on save
NoteSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Note = mongoose.model("Note", NoteSchema);

export default Note;