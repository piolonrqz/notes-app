
import React, { useEffect } from 'react';
import { useWallet } from '../../hooks/useWallet';
import { formatLovelace, truncateAddress } from '../../utils/cardano';
import '../styles/WalletInfo.css';

export const WalletInfo = () => {
    const { isConnected, walletAddress, balance, getBalance, loading, error } = useWallet();

    useEffect(() => {
        if (isConnected) {
            getBalance();
            const interval = setInterval(getBalance, 30000); // Refresh every 30 seconds
            return () => clearInterval(interval);
        }
    }, [isConnected, getBalance]);

    if (!isConnected) {
        return (
            <div className="wallet-info-container">
                <p className="not-connected">Wallet not connected</p>
            </div>
        );
    }

    return (
        <div className="wallet-info-container">
            <div className="info-card">
                <h3>Wallet Address</h3>
                <p className="address">{truncateAddress(walletAddress, 16)}</p>
            </div>

            <div className="info-card">
                <h3>Balance</h3>
                {loading ? (
                    <p className="loading">Loading...</p>
                ) : (
                    <p className="balance">{balance ? formatLovelace(balance) : '0'} ADA</p>
                )}
            </div>

            {error && <div className="error-message">{error}</div>}
        </div>
    );
};
