import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { BrowserWallet } from '@meshsdk/core';
import toast from 'react-hot-toast';

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
    const [wallet, setWallet] = useState(null);
    const [address, setAddress] = useState(null);
    const [connected, setConnected] = useState(false);
    const [connecting, setConnecting] = useState(false);
    const [balance, setBalance] = useState('0');
    const hasAutoConnectedRef = useRef(false);
    const balanceIntervalRef = useRef(null);

    // Fetch balance from wallet
    const fetchBalance = useCallback(async () => {
        if (!wallet) return;
        try {
            const lovelace = await wallet.getLovelace();
            const adaBalance = (parseInt(lovelace) / 1000000).toFixed(2);
            setBalance(adaBalance);
            return adaBalance;
        } catch (error) {
            console.error('Error fetching balance:', error);
            return null;
        }
    }, [wallet]);

    const disconnectWallet = useCallback(() => {
        // Clear balance refresh interval
        if (balanceIntervalRef.current) {
            clearInterval(balanceIntervalRef.current);
            balanceIntervalRef.current = null;
        }
        setWallet(null);
        setAddress(null);
        setConnected(false);
        setBalance('0');
        localStorage.removeItem('connectedWallet');
        localStorage.removeItem('walletAddress');
    }, []);

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

            setConnected(true);

            // Balance will be fetched automatically by the useEffect hook

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
    }, [disconnectWallet]);

    // Refresh balance periodically when connected
    useEffect(() => {
        if (connected && wallet) {
            // Initial fetch
            fetchBalance();

            // Set up periodic refresh every 30 seconds
            balanceIntervalRef.current = setInterval(() => {
                fetchBalance();
            }, 30000); // Refresh every 30 seconds

            return () => {
                if (balanceIntervalRef.current) {
                    clearInterval(balanceIntervalRef.current);
                    balanceIntervalRef.current = null;
                }
            };
        }
    }, [connected, wallet, fetchBalance]);

    // Auto-connect on mount
    useEffect(() => {
        if (hasAutoConnectedRef.current) {
            return;
        }
        const lastWallet = localStorage.getItem('connectedWallet');
        if (lastWallet) {
            hasAutoConnectedRef.current = true;
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
            disconnectWallet,
            refreshBalance: fetchBalance  // Function to manually refresh balance
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