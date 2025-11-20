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
<<<<<<< HEAD
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
=======
      const savedAddress = localStorage.getItem('walletAddress');
      
      if (wasConnected === 'true' && savedAddress && checkLaceInstalled()) {
        try {
          await connectWallet();
>>>>>>> 5cf08634cd9da1fb0ababaca4565a4bc84a594a4
        } catch (error) {
          console.error('Auto-connect failed:', error);
          disconnectWallet();
        }
      }
    };

    autoConnect();
<<<<<<< HEAD
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    wallet,
=======
  }, []);

  const connectWallet = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if Lace is installed
      if (!checkLaceInstalled()) {
        throw new Error(
          'Lace wallet not found. Please install Lace from https://www.lace.io/'
        );
      }

      console.log('Connecting to Lace wallet...');

      // Enable Lace wallet
      const api = await window.cardano.lace.enable();
      
      if (!api) {
        throw new Error('Failed to enable Lace wallet');
      }

      console.log('Lace enabled, initializing Lucid...');

      // Initialize Lucid WITHOUT Blockfrost (use wallet's provider)
      const lucidInstance = await Lucid.new(undefined, 'Preprod');
      
      // Select the wallet
      lucidInstance.selectWallet(api);

      console.log('Getting wallet address...');

      // Get wallet address
      const walletAddress = await lucidInstance.wallet.address();

      console.log('Wallet connected:', walletAddress);

      // Validate address format
      if (!walletAddress || !walletAddress.startsWith('addr')) {
        throw new Error('Invalid Cardano address format');
      }

      // Update state
      setLucid(lucidInstance);
      setAddress(walletAddress);
      setConnected(true);
      
      // Store in localStorage
      localStorage.setItem('walletConnected', 'true');
      localStorage.setItem('walletAddress', walletAddress);
      
      return { lucid: lucidInstance, address: walletAddress };
    } catch (error) {
      console.error('Wallet connection error:', error);
      
      // Better error messages
      let errorMessage = error.message;
      
      if (error.message?.includes('User declined')) {
        errorMessage = 'Connection rejected. Please approve the connection in Lace.';
      } else if (error.message?.includes('Already processing')) {
        errorMessage = 'Please check Lace wallet - there may be a pending request.';
      } else if (!window.cardano?.lace) {
        errorMessage = 'Lace wallet not detected. Please install it from lace.io';
      }
      
      setError(errorMessage);
      disconnectWallet();
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const disconnectWallet = () => {
    setLucid(null);
    setAddress(null);
    setConnected(false);
    setError(null);
    localStorage.removeItem('walletConnected');
    localStorage.removeItem('walletAddress');
  };

  // Get wallet balance
  const getBalance = async () => {
    if (!lucid) return null;
    
    try {
      const utxos = await lucid.wallet.getUtxos();
      let lovelace = 0n;
      
      utxos.forEach(utxo => {
        lovelace += utxo.assets.lovelace || 0n;
      });
      
      // Convert to ADA
      return Number(lovelace) / 1000000;
    } catch (error) {
      console.error('Error getting balance:', error);
      return null;
    }
  };

  return {
    lucid,
>>>>>>> 5cf08634cd9da1fb0ababaca4565a4bc84a594a4
    address,
    connected,
    loading,
    error,
    connectWallet,
    disconnectWallet,
<<<<<<< HEAD
    getBalance
  };
};
=======
    getBalance,
    isLaceInstalled: checkLaceInstalled()
  };
};
>>>>>>> 5cf08634cd9da1fb0ababaca4565a4bc84a594a4
