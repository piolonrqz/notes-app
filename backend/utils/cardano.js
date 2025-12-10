/**
 * Cardano blockchain utilities for Notes App
 * Handles transaction creation and metadata formatting
 */

/**
 * Create metadata for note operations
 * Using label 42819 (not reserved, safe for custom apps)
 */

export const createNoteMetadata = (operation, noteData) => {
    const { noteId, title, content } = noteData;

    return {
        42819: {
            action: operation,
            note_id: noteId,
            title: title?.substring(0, 64) || 'Untitled',
            content: content?.substring(0, 200) || '', // Preview only
            timestamp: new Date().toISOString()
        }
    };
};

// Validate transaction hash format
export const isValidTxHash = (hash) => {
    if (!hash) return false;
    
    // Allow dev mode tx hashes
    if (process.env.NODE_ENV === 'development' && hash.startsWith('dev_tx_')) {
        return true;
    }
    
    // Real Cardano tx hash: 64 hex characters
    return /^[a-f0-9]{64}$/i.test(hash);
};

/**
 * Format operation string to standardized format
 * @param {String} operation - Operation type (create, update, delete, etc.)
 * @returns {String} Formatted operation string
 */
export const formatOperation = (operation) => {
    if (!operation) return 'UNKNOWN';
    
    const normalized = operation.toLowerCase();
    const standardOps = ['create', 'update', 'delete'];
    
    if (standardOps.includes(normalized)) {
        return `${normalized.toUpperCase()}_NOTE`;
    }
    
    return operation.toUpperCase();
};

/**
 * Helper function to chunk text into 64-byte segments for Cardano metadata
 * @param {String} text - Text to chunk
 * @param {Number} maxBytes - Maximum bytes per chunk (default 64)
 * @returns {Array<String>} Array of chunked strings
 */
const chunkText = (text, maxBytes = 64) => {
  if (!text) return [];
  
  const chunks = [];
  let currentChunk = '';
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const testChunk = currentChunk + char;
    
    // Check if adding this character would exceed the byte limit
    if (new Blob([testChunk]).size > maxBytes) {
      // Save current chunk and start new one
      if (currentChunk) chunks.push(currentChunk);
      currentChunk = char;
    } else {
      currentChunk = testChunk;
    }
  }
  
  // Add the last chunk if it exists
  if (currentChunk) chunks.push(currentChunk);
  
  return chunks;
};

/**
 * Create blockchain transaction for note operations
 * @param {Object} wallet - Connected MeshSDK wallet
 * @param {Object} noteData - Note data (noteId, title, content)
 * @param {String} operation - Operation type: CREATE, UPDATE, DELETE
 * @returns {String} Transaction hash
 */
export const createNoteTransaction = async (wallet, noteData, operation) => {
  try {
    // Dynamically import MeshSDK Transaction
    const { Transaction } = await import('@meshsdk/core');
    
    // Get wallet address
    const addresses = await wallet.getUsedAddresses();
    const walletAddress = addresses[0];

    // Create metadata array with chunked content
    const metadataMsg = [
      `Op: ${operation}`,
      `ID: ${noteData.noteId || 'new'}`
    ];

    // Add title (with proper byte calculation including prefix)
    const title = noteData.title || 'Untitled';
    const titlePrefix = 'T: ';
    const titleMaxBytes = 64 - new Blob([titlePrefix]).size; // 64 - 3 = 61 bytes
    const titleChunks = chunkText(title, titleMaxBytes);
    
    titleChunks.forEach((chunk, index) => {
      if (titleChunks.length > 1) {
        const prefix = `T${index + 1}: `;
        const maxBytes = 64 - new Blob([prefix]).size;
        const rechunked = chunkText(chunk, maxBytes);
        rechunked.forEach(c => metadataMsg.push(`${prefix}${c}`));
      } else {
        metadataMsg.push(`${titlePrefix}${chunk}`);
      }
    });

    // Add content (limit to first 300 characters, with proper byte calculation)
    const limitedContent = (noteData.content || '').substring(0, 300);
    
    limitedContent.split('').forEach((char, index) => {
      const chunkIndex = Math.floor(index / 50); // 50 chars per chunk (conservative)
      const prefix = `C${chunkIndex + 1}: `;
      const currentChunk = limitedContent.substring(chunkIndex * 50, (chunkIndex + 1) * 50);
      
      // Only add if not already added
      if (index % 50 === 0) {
        const fullString = `${prefix}${currentChunk}`;
        // Verify it's under 64 bytes
        if (new Blob([fullString]).size <= 64) {
          metadataMsg.push(fullString);
        } else {
          // If still too long, chunk more aggressively
          const evenSmallerChunks = chunkText(currentChunk, 64 - new Blob([prefix]).size);
          evenSmallerChunks.forEach(c => metadataMsg.push(`${prefix}${c}`));
        }
      }
    });

    // Create metadata for blockchain
    const metadata = {
      674: {
        msg: metadataMsg
      }
    };

    // Build transaction
    const tx = new Transaction({ initiator: wallet });
    
    // Send 1 ADA to yourself with metadata (minimum transaction)
    tx.sendLovelace(
      walletAddress,
      '1000000' // 1 ADA in lovelace
    );
    
    tx.setMetadata(674, metadata[674]);

    // Build and sign transaction
    const unsignedTx = await tx.build();
    const signedTx = await wallet.signTx(unsignedTx);
    
    // Submit to blockchain
    const txHash = await wallet.submitTx(signedTx);

    return txHash;
  } catch (error) {
    console.error('Transaction error:', error);
    
    // Handle specific error cases
    if (error.message?.includes('User declined') || error.message?.includes('cancelled')) {
      throw new Error('Transaction cancelled by user');
    } else if (error.message?.includes('Insufficient')) {
      throw new Error('Insufficient ADA balance. You need at least 1.5 ADA.');
    } else {
      throw new Error(error.message || 'Failed to create blockchain transaction');
    }
  }
};

/**
 * Check if user has sufficient balance for transaction
 * @param {Object} wallet - MeshSDK wallet
 * @returns {Promise<boolean>}
 */
export const checkBalance = async (wallet) => {
  try {
    const balance = await wallet.getBalance();
    
    // Parse balance (assuming it's in lovelace format)
    const lovelaceBalance = BigInt(balance[0]?.quantity || '0');
    
    // Need at least 1.5 ADA (1 ADA + fees)
    const minimumRequired = BigInt(1500000);
    
    return lovelaceBalance >= minimumRequired;
  } catch (error) {
    console.error('Error checking balance:', error);
    return false;
  }
};

/**
 * Get formatted ADA balance
 * @param {Object} wallet - MeshSDK wallet
 * @returns {Promise<string>} Balance in ADA
 */
export const getAdaBalance = async (wallet) => {
  try {
    const balance = await wallet.getBalance();
    
    // Parse balance (assuming it's in lovelace format)
    const lovelaceBalance = BigInt(balance[0]?.quantity || '0');
    
    // Convert lovelace to ADA
    const ada = Number(lovelaceBalance) / 1000000;
    return ada.toFixed(2);
  } catch (error) {
    console.error('Error getting balance:', error);
    return '0.00';
  }
};

/**
 * Send data to backend with wallet authentication
 * @param {String} url - API endpoint URL
 * @param {Object} data - Data to send
 * @param {String} walletAddress - Wallet address for authentication
 * @param {String} method - HTTP method (POST, PUT, DELETE, etc.)
 * @returns {Object} Response data
 */
export const sendToBackend = async (url, data, walletAddress, method = 'POST') => {
  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'x-wallet-address': walletAddress
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
};

/**
 * NEW: Validate Cardano wallet address
 */
export const isValidWalletAddress = (address) => {
    if (!address) return false;
    
    // Allow dev mode addresses
    if (process.env.NODE_ENV === 'development' && address.startsWith('dev_wallet_')) {
        return true;
    }
    
    // Real Cardano addresses start with these prefixes
    const validPrefixes = ['addr1', 'addr_test', 'addr_vkh'];
    return validPrefixes.some(prefix => address.startsWith(prefix));
};

export default {
    createNoteMetadata,
    isValidTxHash,
    formatOperation,
    isValidWalletAddress,
    createNoteTransaction,
    checkBalance,
    getAdaBalance,
    sendToBackend
};