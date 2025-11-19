// utils/cardano.js

/**
 * Cardano blockchain utilities for Notes App
 * Handles transaction creation and metadata formatting
 */

/**
 * Create metadata for note operations
 * Cardano metadata uses label-based structure
 * We'll use label 674 (standard for app metadata)
 */
export const createNoteMetadata = (operation, noteData) => {
    const { noteId, title, content } = noteData;

    return {
        674: {
            msg: [
                `Notes App - ${operation}`,
                `NoteID: ${noteId}`,
                `Title: ${title?.substring(0, 50) || 'Untitled'}`, // Limit metadata size
                `Timestamp: ${new Date().toISOString()}`
            ]
        }
    };
};

/**
 * Validate transaction hash format
 */
export const isValidTxHash = (hash) => {
    return /^[a-f0-9]{64}$/i.test(hash);
};

/**
 * Calculate minimum ADA for transaction
 * Cardano requires minimum 1 ADA per tx
 */
export const getMinimumAda = () => {
    return "1000000"; // 1 ADA in lovelace (1 ADA = 1,000,000 lovelace)
};

/**
 * Format operation type for blockchain
 */
export const formatOperation = (operation) => {
    const operations = {
        create: "CREATE_NOTE",
        update: "UPDATE_NOTE",
        delete: "DELETE_NOTE"
    };

    return operations[operation.toLowerCase()] || operation.toUpperCase();
};

/**
 * Parse Cardano transaction response
 */
export const parseTxResponse = (txResponse) => {
    if (!txResponse || typeof txResponse !== 'string') {
        throw new Error('Invalid transaction response');
    }

    return {
        txHash: txResponse,
        timestamp: new Date(),
        success: true
    };
};

/**
 * Create transaction payload for frontend
 */
export const createTxPayload = (operation, noteData, walletAddress) => {
    return {
        operation: formatOperation(operation),
        metadata: createNoteMetadata(operation, noteData),
        recipient: walletAddress, // Send back to same wallet
        amount: getMinimumAda(),
        noteId: noteData.noteId
    };
};

export default {
    createNoteMetadata,
    isValidTxHash,
    getMinimumAda,
    formatOperation,
    parseTxResponse,
    createTxPayload
};