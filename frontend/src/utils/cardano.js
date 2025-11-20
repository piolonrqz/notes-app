// Cardano network configuration
export const CARDANO_NETWORK = 'testnet';

export const SUPPORTED_WALLETS = ['lace', 'nami', 'eternl', 'begin'];

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
    eternl: '♾️',
    begin: '▶️',
  };
  return icons[walletName?.toLowerCase()] || '💼';
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

    // Create metadata for blockchain
    const metadata = {
      674: {
        msg: [
          `Jakwelin Notes - ${operation}`,
          `NoteID: ${noteData.noteId}`,
          `Title: ${noteData.title?.substring(0, 50) || 'Untitled'}`,
          `Content: ${noteData.content?.substring(0, 100) || ''}`,
          `Timestamp: ${new Date().toISOString()}`
        ]
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
