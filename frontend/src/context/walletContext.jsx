import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { BrowserWallet } from '@meshsdk/core';
import toast from 'react-hot-toast';

// --- THIS LINE WAS LIKELY MISSING ---
const WalletContext = createContext();
// ------------------------------------

export const WalletProvider = ({ children }) => {
    const [wallet, setWallet] = useState(null);
    const [address, setAddress] = useState(null);
    const [connected, setConnected] = useState(false);
    const [connecting, setConnecting] = useState(false);
    const [balance, setBalance] = useState('0');

    // Connect to a specific wallet (e.g., 'lace', 'nami')
    const connectWallet = useCallback(async (walletName = 'lace') => {
        setConnecting(true);
        try {
            // Check if wallet is installed
            const wallets = BrowserWallet.getInstalledWallets();
            if (!wallets.some(w => w.name === walletName)) {
                throw new Error(`${walletName} wallet not found. Please install it.`);
            }

            // Connect to wallet
            const browserWallet = await BrowserWallet.enable(walletName);
            setWallet(browserWallet);

            // Get Network & Address
            const changeAddress = await browserWallet.getChangeAddress();
            setAddress(changeAddress);

            localStorage.setItem('walletAddress', changeAddress);

            // Get Balance (in Lovelace, convert to ADA)
            const lovelace = await browserWallet.getLovelace();
            setBalance((parseInt(lovelace) / 1000000).toFixed(2));

            setConnected(true);

            // Persist connection
            localStorage.setItem('connectedWallet', walletName);
            toast.success(`Connected to ${walletName}`);

        } catch (error) {
            console.error('Wallet connection failed:', error);
            toast.error(error.message || 'Failed to connect wallet');
            disconnectWallet();
        } finally {
            setConnecting(false);
        }
    }, []);

    const disconnectWallet = useCallback(() => {
        setWallet(null);
        setAddress(null);
        setConnected(false);
        setBalance('0');
        localStorage.removeItem('connectedWallet');
        localStorage.removeItem('walletAddress');
    }, []);

    // Auto-connect on mount
    useEffect(() => {
        const lastWallet = localStorage.getItem('connectedWallet');
        if (lastWallet) {
            connectWallet(lastWallet);
        }
    }, [connectWallet]);

    return (
        <WalletContext.Provider value={{
            wallet,      // The MeshSDK Wallet Instance
            address,     // User's Address
            connected,   // Boolean
            connecting,  // Loading state
            balance,     // ADA Balance
            connectWallet,
            disconnectWallet
        }}>
            {children}
        </WalletContext.Provider>
    );
};

export const useWalletContext = () => {
    const context = useContext(WalletContext);
    if (!context) {
        throw new Error('useWalletContext must be used within WalletProvider');
    }
    return context;
};