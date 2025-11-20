import { useState, useEffect } from 'react';

/**
 * Custom hook for Lace wallet connection using MeshSDK
 * @returns {Object} Wallet state and methods
 */
export const useWallet = () => {
  const [wallet, setWallet] = useState(null);
  const [address, setAddress] = useState(null);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Connect to Lace wallet
   */
  const connectWallet = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Dynamically import MeshSDK
      const { BrowserWallet } = await import('@meshsdk/core');
      
      // Check if Lace wallet is available
      const availableWallets = BrowserWallet.getInstalledWallets();
      
      if (!availableWallets.some(w => w.name === 'lace')) {
        throw new Error('Lace wallet not found. Please install Lace wallet extension.');
      }

      // Connect to Lace
      const laceWallet = await BrowserWallet.enable('lace');
      
      // Get wallet address
      const addresses = await laceWallet.getUsedAddresses();
      const walletAddress = addresses[0];

      setWallet(laceWallet);
      setAddress(walletAddress);
      setConnected(true);
      
      // Store in localStorage for persistence
      localStorage.setItem('walletConnected', 'true');
      localStorage.setItem('walletAddress', walletAddress);
      
      return { wallet: laceWallet, address: walletAddress };
    } catch (err) {
      console.error('Wallet connection error:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Disconnect wallet
   */
  const disconnectWallet = () => {
    setWallet(null);
    setAddress(null);
    setConnected(false);
    setError(null);
    localStorage.removeItem('walletConnected');
    localStorage.removeItem('walletAddress');
  };

  /**
   * Get wallet balance
   */
  const getBalance = async () => {
    if (!wallet) {
      throw new Error('Wallet not connected');
    }

    try {
      const balance = await wallet.getBalance();
      return balance;
    } catch (err) {
      console.error('Error getting balance:', err);
      throw err;
    }
  };

  // Auto-reconnect on page load
  useEffect(() => {
    const autoConnect = async () => {
      const wasConnected = localStorage.getItem('walletConnected');
      if (wasConnected === 'true') {
        try {
          // Dynamically import MeshSDK
          const { BrowserWallet } = await import('@meshsdk/core');
          
          // Check if Lace wallet is available
          const availableWallets = BrowserWallet.getInstalledWallets();
          
          if (!availableWallets.some(w => w.name === 'lace')) {
            disconnectWallet();
            return;
          }

          // Connect to Lace
          const laceWallet = await BrowserWallet.enable('lace');
          
          // Get wallet address
          const addresses = await laceWallet.getUsedAddresses();
          const walletAddress = addresses[0];

          setWallet(laceWallet);
          setAddress(walletAddress);
          setConnected(true);
        } catch (error) {
          console.error('Auto-connect failed:', error);
          disconnectWallet();
        }
      }
    };

    autoConnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    wallet,
    address,
    connected,
    loading,
    error,
    connectWallet,
    disconnectWallet,
    getBalance
  };
};
