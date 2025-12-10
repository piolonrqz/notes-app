import Note from "../models/Note.js";
import { formatOperation, isValidTxHash } from "../utils/cardano.js";

/**
 * CREATE - Create a new note with blockchain transaction
 */
export const createNote = async (req, res) => {
  try {
    const { noteId, title, content, txHash } = req.body;
    const walletAddress = req.walletAddress;

    // Validate transaction hash
    if (!isValidTxHash(txHash)) {
      return res.status(400).json({ 
        ok: false, 
        error: "Invalid transaction hash" 
      });
    }

    // Check if note ID already exists
    const existingNote = await Note.findOne({ noteId });
    if (existingNote) {
      return res.status(409).json({ 
        ok: false, 
        error: "Note ID already exists" 
      });
    }

    const note = new Note({
      noteId,
      title,
      content,
      walletAddress,
      status: "pending",
      transactionHistory: [
        { 
          operation: formatOperation("create"), 
          txHash,
          status: "pending",
          timestamp: new Date()
        }
      ],
    });

    await note.save();
    
    res.status(201).json({ 
      ok: true, 
      note,
      message: "Note created. Transaction pending blockchain confirmation."
    });
  } catch (err) {
    console.error("Create note error:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
};

/**
 * READ - Get all notes (no blockchain transaction)
 */
export const getAllNotes = async (req, res) => {
  try {
    const notes = await Note.find({ 
      archived: false 
    }).sort({ createdAt: -1 });
    
    res.json({ 
      ok: true, 
      notes,
      count: notes.length
    });
  } catch (err) {
    console.error("Get notes error:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
};

/**
 * READ - Get single note (no blockchain transaction)
 */
export const getNoteById = async (req, res) => {
  try {
    const { noteId } = req.params;
    const walletAddress = req.walletAddress;
    
    const idQuery = /^[a-fA-F0-9]{24}$/.test(noteId)
      ? { $or: [{ noteId }, { _id: noteId }] }
      : { noteId };

    const note = await Note.findOne({ 
      ...idQuery,
      walletAddress,
      archived: false 
    });
    
    if (!note) {
      return res.status(404).json({ 
        ok: false, 
        error: "Note not found" 
      });
    }
    
    res.json({ ok: true, note });
  } catch (err) {
    console.error("Get note error:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
};

/**
 * UPDATE - Update a note with blockchain transaction
 */
export const updateNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const { title, content, txHash } = req.body;
    const walletAddress = req.walletAddress;

    // Validate transaction hash
    if (!isValidTxHash(txHash)) {
      return res.status(400).json({ 
        ok: false, 
        error: "Invalid transaction hash" 
      });
    }

    const idQuery = /^[a-fA-F0-9]{24}$/.test(noteId)
      ? { $or: [{ noteId }, { _id: noteId }] }
      : { noteId };

    const note = await Note.findOneAndUpdate(
      { ...idQuery, walletAddress, archived: false },
      {
        title,
        content,
        status: "pending",
        $push: { 
          transactionHistory: { 
            operation: formatOperation("update"), 
            txHash,
            status: "pending",
            timestamp: new Date()
          } 
        },
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!note) {
      return res.status(404).json({ 
        ok: false, 
        error: "Note not found" 
      });
    }

    res.json({ 
      ok: true, 
      note,
      message: "Note updated. Transaction pending blockchain confirmation."
    });
  } catch (err) {
    console.error("Update note error:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
};

/**
 * DELETE - Archive/Delete a note with blockchain transaction
 */
export const deleteNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const { txHash } = req.body;
    const walletAddress = req.walletAddress;

    // Validate transaction hash
    if (!isValidTxHash(txHash)) {
      return res.status(400).json({ 
        ok: false, 
        error: "Invalid transaction hash" 
      });
    }

    const idQuery = /^[a-fA-F0-9]{24}$/.test(noteId)
      ? { $or: [{ noteId }, { _id: noteId }] }
      : { noteId };

    const note = await Note.findOneAndUpdate(
      { ...idQuery, walletAddress, archived: false },
      {
        archived: true,
        status: "pending", //
        $push: { 
          transactionHistory: { 
            operation: formatOperation("delete"), 
            txHash,
            status: "pending", //
            timestamp: new Date()
          } 
        },
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!note) {
      return res.status(404).json({ 
        ok: false, 
        error: "Note not found" 
      });
    }

    res.json({ 
      ok: true, 
      note,
      message: "Note deleted. Transaction pending blockchain confirmation."
    });
  } catch (err) {
    console.error("Delete note error:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
};

/**
 * READ - Search notes (no blockchain transaction)
 */
export const searchNotes = async (req, res) => {
  try {
    const { query } = req.query;
    const walletAddress = req.walletAddress;
    
    if (!query) {
      return res.status(400).json({ 
        ok: false, 
        error: "Search query required" 
      });
    }

    const notes = await Note.find({
      walletAddress,
      archived: false,
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { content: { $regex: query, $options: 'i' } }
      ]
    }).sort({ createdAt: -1 });

    res.json({ 
      ok: true, 
      notes,
      count: notes.length,
      query
    });
  } catch (err) {
    console.error("Search notes error:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
};

/**
 * READ - Get archived notes (no blockchain transaction)
 */
export const getArchivedNotes = async (req, res) => {
  try {
    const notes = await Note.find({ 
      archived: true 
    }).sort({ updatedAt: -1 });
    
    res.json({ 
      ok: true, 
      notes,
      count: notes.length
    });
  } catch (err) {
    console.error("Get archived notes error:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
};

/**
 * ✅ NEW: Toggle pin (local only, no blockchain)
 */
export const togglePin = async (req, res) => {
  try {
    const { noteId } = req.params;
    const walletAddress = req.walletAddress;
    
    const note = await Note.findOne({ noteId, walletAddress });
    
    if (!note) {
      return res.status(404).json({ 
        ok: false, 
        error: "Note not found" 
      });
    }
    
    note.pinned = !note.pinned;
    await note.save();
    
    res.json({ 
      ok: true, 
      note,
      message: `Note ${note.pinned ? 'pinned' : 'unpinned'}`
    });
  } catch (err) {
    console.error("Toggle pin error:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
};

/**
 * ✅ NEW: Toggle star (local only, no blockchain)
 */
export const toggleStar = async (req, res) => {
  try {
    const { noteId } = req.params;
    const walletAddress = req.walletAddress;
    
    const note = await Note.findOne({ noteId, walletAddress });
    
    if (!note) {
      return res.status(404).json({ 
        ok: false, 
        error: "Note not found" 
      });
    }
    
    note.starred = !note.starred;
    await note.save();
    
    res.json({ 
      ok: true, 
      note,
      message: `Note ${note.starred ? 'starred' : 'unstarred'}`
    });
  } catch (err) {
    console.error("Toggle star error:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
};

export default {
  createNote,
  getAllNotes,
  getNoteById,
  updateNote,
  deleteNote,
  searchNotes,
  getArchivedNotes,
  togglePin,
  toggleStar
};