// routes/notesRoutes.js

import express from "express";
import {
  createNote,
  getAllNotes,
  getNoteById,
  updateNote,
  deleteNote,
  searchNotes,
  getArchivedNotes
} from "../Controller/notesController.js";
import { 
  validateWalletAddress, 
  validateTxHash 
} from "../middleware/walletAuth.js";

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
 *     parameters:
 *       - in: header
 *         name: x-wallet-address
 *         required: true
 *         schema:
 *           type: string
 *         description: Cardano wallet address
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - noteId
 *               - txHash
 *             properties:
 *               noteId:
 *                 type: string
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               txHash:
 *                 type: string
 *                 description: Cardano transaction hash
 *     responses:
 *       201:
 *         description: Note created successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Wallet authentication required
 */
router.post("/", validateTxHash, createNote);

/**
 * @swagger
 * /api/notes:
 *   get:
 *     summary: Get all notes for connected wallet
 *     tags: [Notes]
 *     parameters:
 *       - in: header
 *         name: x-wallet-address
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of notes
 */
router.get("/", getAllNotes);

/**
 * @swagger
 * /api/notes/search:
 *   get:
 *     summary: Search notes (local operation, no blockchain)
 *     tags: [Notes]
 *     parameters:
 *       - in: header
 *         name: x-wallet-address
 *         required: true
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Search results
 */
router.get("/search", searchNotes);

/**
 * @swagger
 * /api/notes/archived:
 *   get:
 *     summary: Get archived notes
 *     tags: [Notes]
 *     parameters:
 *       - in: header
 *         name: x-wallet-address
 *         required: true
 *     responses:
 *       200:
 *         description: List of archived notes
 */
router.get("/archived", getArchivedNotes);

/**
 * @swagger
 * /api/notes/{noteId}:
 *   get:
 *     summary: Get a single note
 *     tags: [Notes]
 *     parameters:
 *       - in: header
 *         name: x-wallet-address
 *         required: true
 *       - in: path
 *         name: noteId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Note details
 *       404:
 *         description: Note not found
 */
router.get("/:noteId", getNoteById);

/**
 * @swagger
 * /api/notes/{noteId}:
 *   put:
 *     summary: Update a note (requires blockchain transaction)
 *     tags: [Notes]
 *     parameters:
 *       - in: header
 *         name: x-wallet-address
 *         required: true
 *       - in: path
 *         name: noteId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - txHash
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               txHash:
 *                 type: string
 *     responses:
 *       200:
 *         description: Note updated
 *       404:
 *         description: Note not found
 */
router.put("/:noteId", validateTxHash, updateNote);

/**
 * @swagger
 * /api/notes/{noteId}:
 *   delete:
 *     summary: Delete/Archive a note (requires blockchain transaction)
 *     tags: [Notes]
 *     parameters:
 *       - in: header
 *         name: x-wallet-address
 *         required: true
 *       - in: path
 *         name: noteId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - txHash
 *             properties:
 *               txHash:
 *                 type: string
 *     responses:
 *       200:
 *         description: Note deleted
 *       404:
 *         description: Note not found
 */
router.delete("/:noteId", validateTxHash, deleteNote);

export default router;