import express from "express";
import {
  getPendingTransactions,
  updateTransactionStatus,
  getStatusStats
} from "../Controller/statusController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Status
 *   description: Transaction status management for background worker
 */

/**
 * @swagger
 * /api/status/pending:
 *   get:
 *     summary: Get all pending transactions (for background worker)
 *     tags: [Status]
 *     responses:
 *       200:
 *         description: List of pending transactions
 */
router.get("/pending", getPendingTransactions);

/**
 * @swagger
 * /api/status/update:
 *   post:
 *     summary: Update transaction status (called by background worker)
 *     tags: [Status]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - txHash
 *               - status
 *             properties:
 *               txHash:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, failed]
 *               blockHeight:
 *                 type: number
 *               blockTime:
 *                 type: string
 *     responses:
 *       200:
 *         description: Status updated
 */
router.post("/update", updateTransactionStatus);

/**
 * @swagger
 * /api/status/stats:
 *   get:
 *     summary: Get transaction status statistics
 *     tags: [Status]
 *     responses:
 *       200:
 *         description: Status statistics
 */
router.get("/stats", getStatusStats);

export default router;