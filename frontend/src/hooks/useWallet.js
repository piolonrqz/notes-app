import { useState, useEffect } from 'react';

export const useWallet = () => {
  const [address, setAddress] = useState(null);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check if wallet was previously connected
  useEffect(() => {
    const savedAddress = localStorage.getItem('walletAddress');
    if (savedAddress) {
      setAddress(savedAddress);
      setConnected(true);
    }
  }, []);

  const connectWallet = async () => {
    try {
      setLoading(true);
      
      // For now, use a dummy address until Lace is integrated
      // Later: const wallet = await BrowserWallet.enable('lace');
      const dummyAddress = 'addr1_dev_' + Date.now();
      
      setAddress(dummyAddress);
      setConnected(true);
      localStorage.setItem('walletAddress', dummyAddress);
      
      return dummyAddress;
    } catch (error) {
      console.error('Wallet connection error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const disconnectWallet = () => {
    setAddress(null);
    setConnected(false);
    localStorage.removeItem('walletAddress');
  };

  return {
    address,
    connected,
    loading,
    connectWallet,
    disconnectWallet
  };
};