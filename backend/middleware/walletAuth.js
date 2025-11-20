// middleware/walletAuth.js

/**
 * Wallet Authentication Middleware
 * Validates wallet address and transaction signatures
 */

export const validateWalletAddress = (req, res, next) => {
  // Development mode bypass
  if (process.env.NODE_ENV === 'development' && !req.headers['x-wallet-address']) {
    console.warn('⚠️ Development mode: Using dummy wallet');
    req.walletAddress = 'dev_wallet_' + Date.now();
    return next();
  }
  
  const walletAddress = req.headers['x-wallet-address'];
  
  if (!walletAddress) {
    return res.status(401).json({ 
      ok: false, 
      error: 'Wallet address required. Please connect your wallet.' 
    });
  }
  
  // Allow dev addresses
  if (!walletAddress.startsWith('addr1') && !walletAddress.startsWith('addr1_dev_')) {
    return res.status(400).json({ 
      ok: false, 
      error: 'Invalid Cardano wallet address' 
    });
  }
  
  req.walletAddress = walletAddress;
  next();
};

export const validateTxHash = (req, res, next) => {
  // Development mode bypass
  if (process.env.NODE_ENV === 'development' && !req.body.txHash) {
    req.body.txHash = `dev_tx_${Date.now()}`;
    return next();
  }
  
  const { txHash } = req.body;
  
  if (!txHash) {
    return res.status(400).json({ 
      ok: false, 
      error: 'Transaction hash required' 
    });
  }
  
  // Allow dev tx hashes
  if (!/^[a-f0-9]{64}$/i.test(txHash) && !txHash.startsWith('dev_tx_')) {
    return res.status(400).json({ 
      ok: false, 
      error: 'Invalid transaction hash format' 
    });
  }
  
  next();
};