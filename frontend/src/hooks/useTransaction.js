import { useState, useCallback } from 'react';
import { blockchainService } from '../services/blockchainService';

export const useTransaction = () => {
    const [transaction, setTransaction] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [txHash, setTxHash] = useState(null);

    const sendTransaction = useCallback(async (toAddress, amount) => {
        setLoading(true);
        setError(null);

        try {
            const tx = await blockchainService.sendTransaction(toAddress, amount);
            setTransaction(tx);
            setTxHash(tx.hash);
            return tx;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getTransactionStatus = useCallback(async (hash) => {
        try {
            const status = await blockchainService.getTransactionStatus(hash);
            return status;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, []);

    const clearTransaction = useCallback(() => {
        setTransaction(null);
        setTxHash(null);
        setError(null);
    }, []);

    return {
        transaction,
        loading,
        error,
        txHash,
        sendTransaction,
        getTransactionStatus,
        clearTransaction,
    };
};