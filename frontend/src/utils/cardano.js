<<<<<<< HEAD
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
          `Notes App - ${operation}`,
          `NoteID: ${noteData.noteId}`,
          `Title: ${noteData.title?.substring(0, 50) || 'Untitled'}`,
=======
// src/utils/cardano.js - Using Lucid Cardano

import toast from 'react-hot-toast';

/**
 * Create and submit a blockchain transaction for note operations
 * @param {Object} lucid - Lucid instance
 * @param {Object} noteData - Note data (noteId, title, content)
 * @param {string} operation - Operation type (CREATE, UPDATE, DELETE)
 * @returns {Promise<string>} Transaction hash
 */
export const createNoteTransaction = async (lucid, noteData, operation) => {
  try {
    // Get wallet address
    const walletAddress = await lucid.wallet.address();

    // Create metadata for the transaction
    const metadata = {
      674: {
        msg: [
          `Jakwelin Notes - ${operation}`,
          `NoteID: ${noteData.noteId}`,
          `Title: ${noteData.title?.substring(0, 50) || 'Untitled'}`,
          `Content: ${noteData.content?.substring(0, 100) || ''}`,
>>>>>>> 5cf08634cd9da1fb0ababaca4565a4bc84a594a4
          `Timestamp: ${new Date().toISOString()}`
        ]
      }
    };

<<<<<<< HEAD
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
=======
    console.log('Creating transaction with metadata:', metadata);

    // Build transaction
    console.log('Building transaction...');
    const tx = await lucid
      .newTx()
      .payToAddress(walletAddress, { lovelace: 1000000n }) // Send 1 ADA to yourself
      .attachMetadata(674, metadata[674])
      .complete({
        // Use local UTxO selection
        localUPLCEval: false
      });

    console.log('Transaction built, waiting for signature...');
    toast.loading('Please sign the transaction in Lace wallet...', { id: 'tx-sign' });

    // Sign transaction
    const signedTx = await tx.sign().complete();
    toast.dismiss('tx-sign');

    console.log('Transaction signed, submitting...');
    toast.loading('Submitting transaction...', { id: 'tx-submit' });

    // Submit to blockchain
    const txHash = await signedTx.submit();
    toast.dismiss('tx-submit');

    console.log('Transaction submitted! Hash:', txHash);
>>>>>>> 5cf08634cd9da1fb0ababaca4565a4bc84a594a4

    return txHash;
  } catch (error) {
    console.error('Transaction error:', error);
<<<<<<< HEAD
    throw new Error(`Failed to create blockchain transaction: ${error.message}`);
=======
    toast.dismiss('tx-sign');
    toast.dismiss('tx-submit');

    // Handle specific error cases
    if (error.message?.includes('User declined') || error.message?.includes('cancelled')) {
      throw new Error('Transaction cancelled by user');
    } else if (error.message?.includes('Insufficient') || error.message?.includes('UTxO Balance Insufficient')) {
      throw new Error('Insufficient ADA balance. You need at least 1.5 ADA.');
    } else {
      throw new Error(error.message || 'Transaction failed');
    }
>>>>>>> 5cf08634cd9da1fb0ababaca4565a4bc84a594a4
  }
};

/**
<<<<<<< HEAD
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
=======
 * Check if user has sufficient balance for transaction
 * @param {Object} lucid - Lucid instance
 * @returns {Promise<boolean>}
 */
export const checkBalance = async (lucid) => {
  try {
    const utxos = await lucid.wallet.getUtxos();
    let lovelace = 0n;

    utxos.forEach(utxo => {
      lovelace += utxo.assets.lovelace || 0n;
    });

    // Need at least 1.5 ADA (1 ADA + fees)
    const minimumRequired = 1500000n;

    return lovelace >= minimumRequired;
  } catch (error) {
    console.error('Error checking balance:', error);
    return false;
  }
};

/**
 * Get formatted ADA balance
 * @param {Object} lucid - Lucid instance
 * @returns {Promise<string>} Balance in ADA
 */
export const getAdaBalance = async (lucid) => {
  try {
    const utxos = await lucid.wallet.getUtxos();
    let lovelace = 0n;

    utxos.forEach(utxo => {
      lovelace += utxo.assets.lovelace || 0n;
    });

    // Convert lovelace to ADA
    const ada = Number(lovelace) / 1000000;
    return ada.toFixed(2);
  } catch (error) {
    console.error('Error getting balance:', error);
    return '0.00';
  }
};

/**
 * Wait for transaction confirmation
 * @param {Object} lucid - Lucid instance
 * @param {string} txHash - Transaction hash
 * @returns {Promise<boolean>}
 */
export const waitForConfirmation = async (lucid, txHash) => {
  try {
    console.log('Waiting for transaction confirmation...');
    await lucid.awaitTx(txHash);
    console.log('Transaction confirmed!');
    return true;
  } catch (error) {
    console.error('Error waiting for confirmation:', error);
    return false;
  }
};

/**
 * Format operation type
 * @param {string} operation
 * @returns {string}
 */
export const formatOperation = (operation) => {
  const operations = {
    create: 'CREATE',
    update: 'UPDATE',
    delete: 'DELETE'
  };
  return operations[operation.toLowerCase()] || operation.toUpperCase();
};

export default {
  createNoteTransaction,
  checkBalance,
  getAdaBalance,
  waitForConfirmation,
  formatOperation
};
>>>>>>> 5cf08634cd9da1fb0ababaca4565a4bc84a594a4
