import express from "express";
import {
  createNote,
  getAllNotes,
  getNoteById,
  updateNote,
  deleteNote,
  searchNotes,
  getArchivedNotes,
  togglePin,
  toggleStar
} from "../Controller/notesController.js";
import { 
  validateWalletAddress, 
  validateTxHash 
} from "../middleware/walletAuth.js";
import { txLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

// Apply wallet validation to all routes
router.use(validateWalletAddress);

/**
 * @swagger
 * tags:
 *   name: Notes
 *   description: Notes API with Cardano blockchain integration
 */

/**
 * @swagger
 * /api/notes:
 *   post:
 *     summary: Create a new note (requires blockchain transaction)
 *     tags: [Notes]
 */
router.post("/", validateTxHash, txLimiter, createNote);

/**
 * @swagger
 * /api/notes:
 *   get:
 *     summary: Get all notes
 *     tags: [Notes]
 */
router.get("/", getAllNotes);

/**
 * @swagger
 * /api/notes/search:
 *   get:
 *     summary: Search notes (local operation, no blockchain)
 *     tags: [Notes]
 */
router.get("/search", searchNotes);

/**
 * @swagger
 * /api/notes/archived:
 *   get:
 *     summary: Get archived notes
 *     tags: [Notes]
 */
router.get("/archived", getArchivedNotes);

/**
 * @swagger
 * /api/notes/{noteId}:
 *   get:
 *     summary: Get a single note
 *     tags: [Notes]
 */
router.get("/:noteId", getNoteById);

/**
 * NEW: Toggle pin (local only, no blockchain)
 * @swagger
 * /api/notes/{noteId}/pin:
 *   patch:
 *     summary: Toggle pin status (local only, instant)
 *     tags: [Notes]
 */
router.patch("/:noteId/pin", togglePin);

/**
 * NEW: Toggle star (local only, no blockchain)
 * @swagger
 * /api/notes/{noteId}/star:
 *   patch:
 *     summary: Toggle star status (local only, instant)
 *     tags: [Notes]
 */
router.patch("/:noteId/star", toggleStar);

/**
 * @swagger
 * /api/notes/{noteId}:
 *   put:
 *     summary: Update a note (requires blockchain transaction)
 *     tags: [Notes]
 */
router.put("/:noteId", validateTxHash, txLimiter, updateNote);

/**
 * @swagger
 * /api/notes/{noteId}:
 *   delete:
 *     summary: Delete/Archive a note (requires blockchain transaction)
 *     tags: [Notes]
 */
router.delete("/:noteId", validateTxHash, txLimiter, deleteNote);

export default router;