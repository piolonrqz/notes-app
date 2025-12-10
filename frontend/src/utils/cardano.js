// Cardano network configuration
export const CARDANO_NETWORK = 'preview';

export const SUPPORTED_WALLETS = ['lace', 'nami'];

// Format lovelace to ADA
export const formatLovelace = (lovelace) => {
  if (!lovelace) return '0';
  const ada = BigInt(lovelace) / BigInt(1000000);
  const remainder = BigInt(lovelace) % BigInt(1000000);
  return `${ada}.${String(remainder).padStart(6, '0')}`;
};

// Convert lovelace to ADA
export const lovelaceToAda = (lovelace) => {
  return Number(lovelace) / 1000000;
};

// Convert ADA to lovelace
export const adaToLovelace = (ada) => {
  return Math.floor(Number(ada) * 1000000);
};

// Truncate address for display
export const truncateAddress = (address, chars = 8) => {
  if (!address) return '';
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
};

// Validate Cardano address
export const isValidAddress = (address) => {
  return /^addr[a-z0-9]{53,88}$/i.test(address);
};

// Get wallet icon emoji
export const getWalletIcon = (walletName) => {
  const icons = {
    lace: '🎯',
    nami: '🦊',
  };
  return icons[walletName?.toLowerCase()] || '💼';
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

export default {
  createNoteTransaction,
  checkBalance,
  getAdaBalance,
  sendToBackend,
  formatLovelace,
  lovelaceToAda,
  adaToLovelace,
  truncateAddress,
  isValidAddress,
  getWalletIcon
};