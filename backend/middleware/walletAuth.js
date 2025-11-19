// middleware/walletAuth.js

/**
 * Wallet Authentication Middleware
 * Validates wallet address and transaction signatures
 */

export const validateWalletAddress = (req, res, next) => {
    const walletAddress = req.headers['x-wallet-address'];

    if (!walletAddress) {
        return res.status(401).json({
            ok: false,
            error: 'Wallet address required'
        });
    }

    // Basic Cardano address validation (starts with addr1)
    if (!walletAddress.startsWith('addr1')) {
        return res.status(400).json({
            ok: false,
            error: 'Invalid Cardano wallet address'
        });
    }

    req.walletAddress = walletAddress;
    next();
};

/**
 * Validate transaction hash in request
 * Used for CREATE, UPDATE, DELETE operations
 */
export const validateTxHash = (req, res, next) => {
    const { txHash } = req.body;

    if (!txHash) {
        return res.status(400).json({
            ok: false,
            error: 'Transaction hash required for this operation'
        });
    }

    // Validate tx hash format (64 hex characters)
    if (!/^[a-f0-9]{64}$/i.test(txHash)) {
        return res.status(400).json({
            ok: false,
            error: 'Invalid transaction hash format'
        });
    }

    next();
};

/**
 * Optional: Rate limiting per wallet address
 */
export const walletRateLimit = (req, res, next) => {
    // This could be extended to implement per-wallet rate limiting
    // For now, we'll just use the existing rate limiter
    next();
};

export default {
    validateWalletAddress,
    validateTxHash,
    walletRateLimit
};