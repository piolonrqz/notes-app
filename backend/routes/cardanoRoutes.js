// routes/cardanoRoutes.js
import express from "express";
import blockfrostService from "../services/blockfrostService.js";
import { validateWalletAddress } from "../middleware/walletAuth.js";

const router = express.Router();

router.use(validateWalletAddress);

/**
 * @swagger
 * /api/cardano/transaction/{txHash}:
 *   get:
 *     summary: Check transaction status
 *     tags: [Cardano]
 */
router.get("/transaction/:txHash", async (req, res) => {
  try {
    const { txHash } = req.params;
    const result = await blockfrostService.checkTransactionStatus(txHash);
    res.json({ ok: true, ...result });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

/**
 * @swagger
 * /api/cardano/recover:
 *   post:
 *     summary: Recover notes from blockchain
 *     tags: [Cardano]
 */
router.post("/recover", async (req, res) => {
  try {
    const walletAddress = req.walletAddress;
    const notes = await blockfrostService.retrieveNotesFromBlockchain(walletAddress);
    res.json({ ok: true, notes, count: notes.length });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

export default router;