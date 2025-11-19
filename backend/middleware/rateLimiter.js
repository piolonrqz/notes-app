import rateLimit from "express-rate-limit";

// General API rate limiter (existing functionality)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP
  message: "Too many requests, please try again later."
});

// Wallet-specific rate limiter
// Uses wallet address as key instead of IP
export const walletLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each wallet to 50 requests per window
  keyGenerator: (req) => {
    // Use wallet address if available, fallback to IP
    return req.walletAddress || req.ip;
  },
  message: "Too many requests from this wallet, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

// Transaction rate limiter (more restrictive for blockchain operations)
// Applied to CREATE, UPDATE, DELETE operations that require tx hash
export const txLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // limit to 5 transaction operations per minute
  keyGenerator: (req) => {
    return req.walletAddress || req.ip;
  },
  message: "Too many transaction operations, please slow down.",
  standardHeaders: true,
  legacyHeaders: false,
});

// Default export for backward compatibility
export default limiter;