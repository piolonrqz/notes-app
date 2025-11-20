// src/hooks/useWallet.js - Simplified Lucid Integration

import { useState, useEffect } from 'react';
import { Lucid, Emulator } from 'lucid-cardano';

export const useWallet = () => {
  const [lucid, setLucid] = useState(null);
  const [address, setAddress] = useState(null);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check if Lace is installed
  const checkLaceInstalled = () => {
    return typeof window !== 'undefined' && window.cardano?.lace;
  };

  // Auto-reconnect on page load
  useEffect(() => {
    const autoConnect = async () => {
      const wasConnected = localStorage.getItem('walletConnected');
      const savedAddress = localStorage.getItem('walletAddress');
      
      if (wasConnected === 'true' && savedAddress && checkLaceInstalled()) {
        try {
          await connectWallet();
        } catch (error) {
          console.error('Auto-connect failed:', error);
          disconnectWallet();
        }
      }
    };

    autoConnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

      // Initialize Lucid with Emulator provider for Preprod (no external API needed)
      // The Emulator provides protocol parameters for transaction building
      const emulator = new Emulator([]);
      const lucidInstance = await Lucid.new(emulator, 'Preprod');

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
    wallet: lucid,  // Changed from 'lucid' to 'wallet' for consistency
    lucid,          // Keep lucid for backward compatibility
    address,
    connected,
    loading,
    error,
    connectWallet,
    disconnectWallet,
    getBalance,
    isLaceInstalled: checkLaceInstalled()
  };
};