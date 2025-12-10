import Note from "../models/Note.js";

/**
 * Get all pending transactions (for background worker)
 * This endpoint is used by the background worker to check transaction status
 */

export const getPendingTransactions = async (req, res) => {
  try {
    // Find all notes with pending status
    const pendingNotes = await Note.find({ 
      status: 'pending' 
    }).select('noteId walletAddress transactionHistory status');
    
    // Extract pending transactions
    const pendingTxs = pendingNotes.map(note => {
      const latestTx = note.transactionHistory[note.transactionHistory.length - 1];
      return {
        noteId: note.noteId,
        walletAddress: note.walletAddress,
        txHash: latestTx?.txHash,
        operation: latestTx?.operation,
        timestamp: latestTx?.timestamp
      };
    }).filter(tx => tx.txHash);
    
    res.json({ 
      ok: true, 
      pendingTransactions: pendingTxs,
      count: pendingTxs.length
    });
  } catch (err) {
    console.error("Get pending transactions error:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
};

/**
 * Update transaction status (called by background worker)
 */
export const updateTransactionStatus = async (req, res) => {
  try {
    const { txHash, status, blockHeight, blockTime } = req.body;
    
    if (!txHash || !status) {
      return res.status(400).json({ 
        ok: false, 
        error: "txHash and status are required" 
      });
    }
    
    if (!['pending', 'confirmed', 'failed'].includes(status)) {
      return res.status(400).json({ 
        ok: false, 
        error: "Invalid status" 
      });
    }
    
    // Find note with this transaction hash
    const note = await Note.findOne({
      'transactionHistory.txHash': txHash
    });
    
    if (!note) {
      return res.status(404).json({ 
        ok: false, 
        error: "Note with this transaction not found" 
      });
    }
    
    // Update overall note status
    note.status = status;
    
    // Update the specific transaction in history
    const txIndex = note.transactionHistory.findIndex(
      tx => tx.txHash === txHash
    );
    
    if (txIndex !== -1) {
      note.transactionHistory[txIndex].status = status;
      if (status === 'confirmed') {
        note.transactionHistory[txIndex].confirmedAt = new Date();
      }
    }
    
    await note.save();
    
    console.log(`✅ Transaction ${status}: ${txHash}`);
    
    res.json({ 
      ok: true, 
      note,
      message: `Transaction status updated to ${status}`
    });
  } catch (err) {
    console.error("Update transaction status error:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
};

/**
 * Get transaction status statistics
 */
export const getStatusStats = async (req, res) => {
  try {
    const stats = await Note.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const formatted = {
      pending: 0,
      confirmed: 0,
      failed: 0
    };
    
    stats.forEach(stat => {
      formatted[stat._id] = stat.count;
    });
    
    res.json({ 
      ok: true, 
      stats: formatted,
      total: Object.values(formatted).reduce((a, b) => a + b, 0)
    });
  } catch (err) {
    console.error("Get status stats error:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
};

export default {
  getPendingTransactions,
  updateTransactionStatus,
  getStatusStats
};