import mongoose from "mongoose";

const { Schema } = mongoose;

const TransactionRecordSchema = new Schema({
  operation: { type: String, required: true }, // CREATE, UPDATE, DELETE
  txHash: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const NoteSchema = new Schema({
  noteId: { type: String, required: true, unique: true },
  title: String,
  content: String,
  archived: { type: Boolean, default: false },
  transactionHistory: { type: [TransactionRecordSchema], default: [] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Note = mongoose.model("Note", NoteSchema);

export default Note;