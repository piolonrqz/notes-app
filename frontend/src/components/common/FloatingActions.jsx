import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon, WalletIcon, X } from 'lucide-react';
import { useWallet } from '../../hooks/useWallet';
import { truncateAddress } from '../../utils/cardano';

/**
 * Floating Action Buttons - Chatbot-style placement
 */
const FloatingActions = () => {
  const { connected, address, connectWallet, disconnectWallet, loading } = useWallet();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleWalletClick = async () => {
    if (connected) {
      disconnectWallet();
    } else {
      try {
        await connectWallet();
      } catch (error) {
        console.error('Wallet connection error:', error);
      }
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col-reverse items-end gap-4">
      {/* Expanded Buttons */}
      {isExpanded && (
        <>
          {/* New Note Button */}
          <Link
            to="/create"
            className="flex items-center gap-3 px-6 py-3 font-medium text-white transition-all duration-300 shadow-2xl bg-gradient-to-r from-brand-medium to-brand-light rounded-2xl hover:shadow-brand-light/50 hover:scale-105 animate-slide-in group"
            onClick={() => setIsExpanded(false)}
          >
            <PlusIcon className="w-5 h-5 group-hover:rotate-90 transition-transform" />
            <span>New Note</span>
          </Link>

          {/* Wallet Button */}
          <button
            onClick={handleWalletClick}
            disabled={loading}
            className={`flex items-center gap-3 px-6 py-3 font-medium transition-all duration-300 shadow-2xl rounded-2xl hover:scale-105 animate-slide-in ${
              connected
                ? 'bg-white text-brand-dark hover:bg-gray-100'
                : 'bg-gradient-to-r from-brand-light to-brand-lighter text-white hover:shadow-brand-lighter/50'
            }`}
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                <span>Connecting...</span>
              </>
            ) : connected ? (
              <>
                <WalletIcon className="w-5 h-5" />
                <span>{truncateAddress(address, 6)}</span>
              </>
            ) : (
              <>
                <WalletIcon className="w-5 h-5" />
                <span>Connect Wallet</span>
              </>
            )}
          </button>
        </>
      )}

      {/* Main Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`flex items-center justify-center w-16 h-16 text-white transition-all duration-300 shadow-2xl bg-gradient-to-br from-brand-medium to-brand-light rounded-2xl hover:shadow-brand-light/50 hover:scale-110 ${
          isExpanded ? 'rotate-45' : 'rotate-0'
        }`}
      >
        {isExpanded ? (
          <X className="w-8 h-8" />
        ) : (
          <PlusIcon className="w-8 h-8" />
        )}
      </button>
    </div>
  );
};

export default FloatingActions;

