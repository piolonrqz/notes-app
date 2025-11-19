import express from "express";
import Note from "../models/Note.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Notes
 *   description: Notes API
 */

/**
 * @swagger
 * /api/notes:
 *   post:
 *     summary: Create a new note
 *     tags: [Notes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               noteId:
 *                 type: string
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               txHash:
 *                 type: string
 *               operation:
 *                 type: string
 *     responses:
 *       201:
 *         description: Note created
 */
router.post("/", async (req, res) => {
  try {
    const { noteId, title, content, txHash, operation } = req.body;

    const note = new Note({
      noteId,
      title,
      content,
      transactionHistory: [{ operation, txHash }],
    });

    await note.save();
    res.status(201).json({ ok: true, note });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

/**
 * @swagger
 * /api/notes:
 *   get:
 *     summary: Get all notes
 *     tags: [Notes]
 */
router.get("/", async (req, res) => {
  try {
    const notes = await Note.find({ archived: false }).sort({ createdAt: -1 });
    res.json({ ok: true, notes });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

/**
 * @swagger
 * /api/notes/{noteId}:
 *   get:
 *     summary: Get a single note
 *     tags: [Notes]
 */
router.get("/:noteId", async (req, res) => {
  try {
    const { noteId } = req.params;
    const note = await Note.findOne({ noteId, archived: false });
    
    if (!note) {
      return res.status(404).json({ ok: false, error: "Note not found" });
    }
    
    res.json({ ok: true, note });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

/**
 * @swagger
 * /api/notes/{noteId}:
 *   put:
 *     summary: Update a note
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: noteId
 *         schema:
 *           type: string
 *         required: true
 *         description: Note ID
 */
router.put("/:noteId", async (req, res) => {
  try {
    const { noteId } = req.params;
    const { title, content, txHash, operation } = req.body;

    const note = await Note.findOneAndUpdate(
      { noteId },
      {
        title,
        content,
        $push: { transactionHistory: { operation, txHash } },
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!note)
      return res.status(404).json({ ok: false, error: "Note not found" });

    res.json({ ok: true, note });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

/**
 * @swagger
 * /api/notes/{noteId}:
 *   delete:
 *     summary: Archive/Delete a note
 *     tags: [Notes]
 */
router.delete("/:noteId", async (req, res) => {
  try {
    const { noteId } = req.params;
    const { txHash, operation } = req.body;

    const note = await Note.findOneAndUpdate(
      { noteId },
      {
        archived: true,
        $push: { transactionHistory: { operation, txHash } },
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!note)
      return res.status(404).json({ ok: false, error: "Note not found" });

    res.json({ ok: true, note });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

export default router;