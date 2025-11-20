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
          `Timestamp: ${new Date().toISOString()}`
        ]
      }
    };

    console.log('Creating transaction with metadata:', metadata);

    // Build transaction
    console.log('Building transaction...');
    const tx = await lucid
      .newTx()
      .payToAddress(walletAddress, { lovelace: 1000000n }) // Send 1 ADA to yourself
      .attachMetadata(674, metadata[674])
      .complete();

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

    return txHash;
  } catch (error) {
    console.error('Transaction error:', error);
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
  }
};

/**
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
