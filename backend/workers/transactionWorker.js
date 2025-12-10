// ✅ FIX: Load environment variables immediately
import 'dotenv/config'; 

import Note from "../models/Note.js";
import blockfrostService from "../services/blockfrostService.js";

class TransactionWorker {
  constructor() {
    this.isRunning = false;
    this.intervalMs = parseInt(process.env.WORKER_INTERVAL_MS) || 20000; // 20 seconds
    this.interval = null;
  }

  /**
   * Start the background worker
   */
  start() {
    if (this.isRunning) {
      console.log("⚠️  Worker already running");
      return;
    }

    this.isRunning = true;
    console.log(`
╔════════════════════════════════════════╗
║  🔄 Background Worker Started          ║
║  ⏱️  Interval: ${this.intervalMs / 1000} seconds             ║
╚════════════════════════════════════════╝
    `);
    
    // Check immediately on start
    this.checkPendingTransactions();
    
    // Then check every interval
    this.interval = setInterval(() => {
      this.checkPendingTransactions();
    }, this.intervalMs);
  }

  /**
   * Stop the background worker
   */
  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
      this.isRunning = false;
      console.log("⏹️  Background worker stopped");
    }
  }

  /**
   * Main worker function - checks all pending transactions
   */
  async checkPendingTransactions() {
    try {
      const timestamp = new Date().toISOString();
      console.log(`\n⏰ [${timestamp}] Worker checking pending transactions...`);

      // Find all notes with pending status
      const pendingNotes = await Note.find({ 
        status: 'pending' 
      }).limit(50); // Limit to prevent overload

      if (pendingNotes.length === 0) {
        console.log("✅ No pending transactions");
        return;
      }

      console.log(`🔍 Found ${pendingNotes.length} pending transaction(s)`);

      let confirmed = 0;
      let stillPending = 0;
      let failed = 0;

      // Check each pending note
      for (const note of pendingNotes) {
        // Get the latest transaction
        const latestTx = note.transactionHistory[note.transactionHistory.length - 1];
        
        if (!latestTx || latestTx.status !== 'pending') {
          continue;
        }

        try {
          // Check Blockfrost API
          const result = await blockfrostService.checkTransactionStatus(latestTx.txHash);

          if (result.confirmed) {
            // Update note to confirmed
            note.status = 'confirmed';
            latestTx.status = 'confirmed';
            latestTx.confirmedAt = new Date();
            
            await note.save();
            
            console.log(`   ✅ Confirmed: ${latestTx.txHash.substring(0, 16)}...`);
            confirmed++;
          } else {
            // Still pending
            console.log(`   ⏳ Pending: ${latestTx.txHash.substring(0, 16)}...`);
            stillPending++;
          }
        } catch (error) {
          console.error(`   ❌ Error: ${latestTx.txHash.substring(0, 16)}... - ${error.message}`);
          
          // Check if transaction failed (optional: mark as failed after X attempts)
          if (error.response?.status === 400) {
            note.status = 'failed';
            latestTx.status = 'failed';
            await note.save();
            failed++;
          } else {
            stillPending++;
          }
        }

        // Small delay between API calls to avoid rate limiting
        await this.delay(500);
      }

      console.log(`📊 Summary: ${confirmed} confirmed, ${stillPending} pending, ${failed} failed`);
    } catch (error) {
      console.error("❌ Worker error:", error.message);
    }
  }

  /**
   * Helper: Delay function
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get worker status
   */
  getStatus() {
    return {
      isRunning: this.isRunning,
      intervalMs: this.intervalMs
    };
  }
}

export default new TransactionWorker();