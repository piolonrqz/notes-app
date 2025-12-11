import React from 'react';
import { useWallet } from '../../hooks/useWallet';
import { Coins } from 'lucide-react';

/**
 * Floating balance display at the top of the screen
 * Shows ADA balance when wallet is connected
 */
const FloatingBalance = () => {
  const { connected, balance } = useWallet();

  if (!connected || !balance) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-brand-light/30 to-brand-lighter/30 border border-brand-light/40 backdrop-blur-md shadow-lg">
        <Coins className="w-4 h-4 text-brand-lighter" />
        <span className="text-sm font-semibold text-white">
          {parseFloat(balance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ADA
        </span>
        <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
};

export default FloatingBalance;

