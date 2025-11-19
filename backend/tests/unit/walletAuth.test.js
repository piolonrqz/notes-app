// tests/unit/walletAuth.test.js

import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import {
    validateWalletAddress,
    validateTxHash,
    walletRateLimit
} from '../../middleware/walletAuth.js';

describe('Wallet Authentication Middleware', () => {
    let mockReq;
    let mockRes;
    let mockNext;

    beforeEach(() => {
        mockReq = {
            headers: {},
            body: {}
        };

        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };

        mockNext = jest.fn();
    });

    describe('validateWalletAddress', () => {
        it('should pass with valid Cardano address', () => {
            mockReq.headers['x-wallet-address'] = 'addr1qxy2lpan066dzqs2j524xfq5gkayfy2wvyy0u49xg2tjm9fxj9z0c5yk4h4q7m6wk3pv6d6d6k3pv6d6d6k3pv6d6d6k3pv6d';

            validateWalletAddress(mockReq, mockRes, mockNext);

            expect(mockNext).toHaveBeenCalled();
            expect(mockReq.walletAddress).toBe('addr1qxy2lpan066dzqs2j524xfq5gkayfy2wvyy0u49xg2tjm9fxj9z0c5yk4h4q7m6wk3pv6d6d6k3pv6d6d6k3pv6d6d6k3pv6d');
            expect(mockRes.status).not.toHaveBeenCalled();
        });

        it('should return 401 when wallet address is missing', () => {
            validateWalletAddress(mockReq, mockRes, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledWith({
                ok: false,
                error: 'Wallet address required'
            });
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should return 400 for invalid Cardano address format', () => {
            mockReq.headers['x-wallet-address'] = 'invalid-wallet-address';

            validateWalletAddress(mockReq, mockRes, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                ok: false,
                error: 'Invalid Cardano wallet address'
            });
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should reject addresses not starting with addr1', () => {
            mockReq.headers['x-wallet-address'] = 'stake1test123';

            validateWalletAddress(mockReq, mockRes, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                ok: false,
                error: 'Invalid Cardano wallet address'
            });
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should handle empty string wallet address', () => {
            mockReq.headers['x-wallet-address'] = '';

            validateWalletAddress(mockReq, mockRes, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should attach wallet address to request object', () => {
            const testAddress = 'addr1test123';
            mockReq.headers['x-wallet-address'] = testAddress;

            validateWalletAddress(mockReq, mockRes, mockNext);

            expect(mockReq.walletAddress).toBe(testAddress);
        });
    });

    describe('validateTxHash', () => {
        it('should pass with valid transaction hash', () => {
            mockReq.body.txHash = 'a'.repeat(64);

            validateTxHash(mockReq, mockRes, mockNext);

            expect(mockNext).toHaveBeenCalled();
            expect(mockRes.status).not.toHaveBeenCalled();
        });

        it('should pass with valid hex hash (mixed case)', () => {
            mockReq.body.txHash = 'A1b2C3d4'.repeat(8); // 64 chars

            validateTxHash(mockReq, mockRes, mockNext);

            expect(mockNext).toHaveBeenCalled();
        });

        it('should return 400 when txHash is missing', () => {
            validateTxHash(mockReq, mockRes, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                ok: false,
                error: 'Transaction hash required for this operation'
            });
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should return 400 for invalid hash length', () => {
            mockReq.body.txHash = 'abc123'; // Too short

            validateTxHash(mockReq, mockRes, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                ok: false,
                error: 'Invalid transaction hash format'
            });
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should return 400 for hash with invalid characters', () => {
            mockReq.body.txHash = 'g'.repeat(64); // 'g' is not hex

            validateTxHash(mockReq, mockRes, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should return 400 for hash that is too long', () => {
            mockReq.body.txHash = 'a'.repeat(65);

            validateTxHash(mockReq, mockRes, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should return 400 for hash with spaces', () => {
            mockReq.body.txHash = 'a'.repeat(32) + ' ' + 'a'.repeat(31);

            validateTxHash(mockReq, mockRes, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should handle empty string txHash', () => {
            mockReq.body.txHash = '';

            validateTxHash(mockReq, mockRes, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockNext).not.toHaveBeenCalled();
        });
    });

    describe('walletRateLimit', () => {
        it('should call next without modifications', () => {
            walletRateLimit(mockReq, mockRes, mockNext);

            expect(mockNext).toHaveBeenCalled();
            expect(mockRes.status).not.toHaveBeenCalled();
        });

        it('should pass through without affecting request', () => {
            const originalReq = { ...mockReq };

            walletRateLimit(mockReq, mockRes, mockNext);

            expect(mockReq).toEqual(originalReq);
            expect(mockNext).toHaveBeenCalledTimes(1);
        });
    });

    describe('Integration scenarios', () => {
        it('should handle middleware chain for valid request', () => {
            mockReq.headers['x-wallet-address'] = 'addr1test123';
            mockReq.body.txHash = 'a'.repeat(64);

            validateWalletAddress(mockReq, mockRes, mockNext);
            expect(mockNext).toHaveBeenCalledTimes(1);

            validateTxHash(mockReq, mockRes, mockNext);
            expect(mockNext).toHaveBeenCalledTimes(2);

            walletRateLimit(mockReq, mockRes, mockNext);
            expect(mockNext).toHaveBeenCalledTimes(3);

            expect(mockRes.status).not.toHaveBeenCalled();
        });

        it('should stop chain on invalid wallet address', () => {
            mockReq.headers['x-wallet-address'] = 'invalid';
            mockReq.body.txHash = 'a'.repeat(64);

            validateWalletAddress(mockReq, mockRes, mockNext);

            expect(mockNext).not.toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(400);
        });

        it('should stop chain on invalid tx hash', () => {
            mockReq.headers['x-wallet-address'] = 'addr1test123';
            mockReq.body.txHash = 'invalid';

            validateWalletAddress(mockReq, mockRes, mockNext);
            expect(mockNext).toHaveBeenCalledTimes(1);

            validateTxHash(mockReq, mockRes, mockNext);
            expect(mockNext).toHaveBeenCalledTimes(1); // Still 1, didn't call again
            expect(mockRes.status).toHaveBeenCalledWith(400);
        });
    });
});
