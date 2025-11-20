
import React, { useEffect, useState } from 'react';
import { useTransaction } from '../../hooks/useTransaction';
import '../styles/TransactionStatus.css';

export const TransactionStatus = ({ txHash }) => {
    const { getTransactionStatus } = useTransaction();
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!txHash) return;

        const fetchStatus = async () => {
            setLoading(true);
            setError(null);
            try {
                const result = await getTransactionStatus(txHash);
                setStatus(result);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStatus();
        const interval = setInterval(fetchStatus, 5000);
        return () => clearInterval(interval);
    }, [txHash, getTransactionStatus]);

    if (!txHash) return null;

    return (
        <div className="transaction-status">
            <div className={`status-badge ${status?.confirmed ? 'confirmed' : 'pending'}`}>
                {status?.confirmed ? '✓ Confirmed' : '⏳ Pending'}
            </div>

            {loading && <p className="loading">Checking status...</p>}

            {error && <p className="error">{error}</p>}

            {status && (
                <div className="status-details">
                    <p><strong>TX Hash:</strong> {txHash}</p>
                    <p><strong>Block:</strong> {status.blockHeight || 'N/A'}</p>
                    <p><strong>Confirmations:</strong> {status.confirmations || 0}</p>
                </div>
            )}
        </div>
    );
};