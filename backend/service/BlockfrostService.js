import axios from "axios";

const BLOCKFROST_PROJECT_ID = process.env.BLOCKFROST_PROJECT_ID;
const BLOCKFROST_API_URL = process.env.BLOCKFROST_API_URL;
const METADATA_LABEL = process.env.METADATA_LABEL || "42819";

class BlockfrostService {
  constructor() {
    this.api = axios.create({
      baseURL: BLOCKFROST_API_URL,
      headers: {
        'project_id': BLOCKFROST_PROJECT_ID
      }
    });
  }

  /**
   * Check if transaction is confirmed on blockchain
   */
  async checkTransactionStatus(txHash) {
    try {
      const response = await this.api.get(`/txs/${txHash}`);
      
      console.log(`✅ Transaction confirmed: ${txHash}`);
      
      return {
        confirmed: true,
        blockHeight: response.data.block_height,
        blockTime: response.data.block_time,
        data: response.data
      };
    } catch (error) {
      if (error.response?.status === 404) {
        // Transaction not found yet (still pending)
        console.log(`⏳ Transaction pending: ${txHash}`);
        return { confirmed: false };
      }
      
      console.error(`❌ Error checking transaction ${txHash}:`, error.message);
      throw error;
    }
  }

  /**
   * Get transaction metadata
   */
  async getTransactionMetadata(txHash) {
    try {
      const response = await this.api.get(`/txs/${txHash}/metadata`);
      
      // Find our app's metadata label
      const appMetadata = response.data.find(
        m => m.label === METADATA_LABEL
      );
      
      return appMetadata?.json_metadata || null;
    } catch (error) {
      console.error(`Error fetching metadata for ${txHash}:`, error.message);
      return null;
    }
  }

  /**
   * Get all transactions for a wallet address
   */
  async getWalletTransactions(walletAddress) {
    try {
      const response = await this.api.get(
        `/addresses/${walletAddress}/transactions`,
        {
          params: {
            order: 'desc',
            count: 100
          }
        }
      );
      
      return response.data.map(tx => tx.tx_hash);
    } catch (error) {
      console.error('Error fetching wallet transactions:', error.message);
      throw error;
    }
  }

  /**
   * Retrieve notes from blockchain (recovery feature)
   */
  async retrieveNotesFromBlockchain(walletAddress) {
    try {
      console.log(`🔍 Retrieving notes for ${walletAddress}...`);
      
      const txHashes = await this.getWalletTransactions(walletAddress);
      const notes = [];

      for (const txHash of txHashes) {
        const metadata = await this.getTransactionMetadata(txHash);
        
        if (metadata) {
          notes.push({
            txHash,
            noteId: metadata.note_id,
            title: this.reconstructContent(metadata.title),
            content: this.reconstructContent(metadata.content),
            action: metadata.action,
            timestamp: metadata.timestamp
          });
        }
      }

      console.log(`✅ Retrieved ${notes.length} notes from blockchain`);
      return notes;
    } catch (error) {
      console.error('Error retrieving notes from blockchain:', error);
      throw error;
    }
  }

  /**
   * Reconstruct chunked content
   */
  reconstructContent(data) {
    if (!data) return "";
    if (typeof data === "string") return data;
    if (Array.isArray(data)) return data.join("");
    return "";
  }
}

export default new BlockfrostService();