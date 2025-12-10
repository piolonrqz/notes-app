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
    getMinimumAda,
    formatOperation,
    parseTxResponse,
    createTxPayload,
    isValidWalletAddress
};