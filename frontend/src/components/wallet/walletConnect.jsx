
import React, { useState } from 'react';
import { useWallet } from '../../hooks/useWallet';
import { SUPPORTED_WALLETS, getWalletIcon, truncateAddress } from '../../utils/cardano';
import '../styles/WalletConnect.css';

export const WalletConnect = () => {
    const { isConnected, walletAddress, connectWallet, disconnectWallet, loading, error } = useWallet();
    const [showWallets, setShowWallets] = useState(false);

    const handleWalletSelect = async (walletName) => {
        try {
            await connectWallet(walletName);
            setShowWallets(false);
        } catch (err) {
            console.error('Wallet connection failed:', err);
        }
    };

    const handleDisconnect = async () => {
        try {
            await disconnectWallet();
        } catch (err) {
            console.error('Wallet disconnection failed:', err);
        }
    };

    if (isConnected && walletAddress) {
        return (
            <div className="wallet-connected">
                <div className="wallet-info">
                    <span className="wallet-address">{truncateAddress(walletAddress)}</span>
                    <button className="disconnect-btn" onClick={handleDisconnect} disabled={loading}>
                        {loading ? 'Disconnecting...' : 'Disconnect'}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="wallet-connect-container">
            <button
                className="connect-btn"
                onClick={() => setShowWallets(!showWallets)}
                disabled={loading}
            >
                {loading ? 'Connecting...' : 'Connect Wallet'}
            </button>

            {showWallets && (
                <div className="wallet-dropdown">
                    {SUPPORTED_WALLETS.map((wallet) => (
                        <button
                            key={wallet}
                            className="wallet-option"
                            onClick={() => handleWalletSelect(wallet)}
                            disabled={loading}
                        >
                            <span className="wallet-icon">{getWalletIcon(wallet)}</span>
                            <span className="wallet-name">{wallet.toUpperCase()}</span>
                        </button>
                    ))}
                </div>
            )}

            {error && <div className="error-message">{error}</div>}
        </div>
    );
};