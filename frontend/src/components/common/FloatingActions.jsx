import React, { useState, useRef, useEffect } from 'react';
import { PlusIcon, WalletIcon, X } from 'lucide-react';
import { useWallet } from '../../hooks/useWallet';
import { truncateAddress } from '../../utils/cardano';
import CreateNoteModal from '../notes/CreateNoteModal';
import toast from 'react-hot-toast';

/**
 * Floating Action Buttons - Chatbot-style placement
 */
const FloatingActions = ({ onNoteCreated }) => {
  const { connected, address, connectWallet, disconnectWallet, loading } = useWallet();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const walletButtonRef = useRef(null);
  const newNoteButtonRef = useRef(null);

  // Measure wallet button height and apply to new note button
  useEffect(() => {
    if (walletButtonRef.current && isExpanded && newNoteButtonRef.current) {
      const height = walletButtonRef.current.offsetHeight;
      newNoteButtonRef.current.style.height = `${height}px`;
    }
  }, [isExpanded, connected, address, loading]);

  const handleWalletClick = async () => {
    if (connected) {
      disconnectWallet();
      toast.success('Wallet disconnected');
    } else {
      try {
        toast.loading('Connecting to Lace wallet...', { id: 'wallet-connect' });
        await connectWallet('lace');
        toast.success('Wallet connected successfully!', { id: 'wallet-connect' });
      } catch (error) {
        console.error('Wallet connection error:', error);
        toast.error(error.message || 'Failed to connect wallet', { id: 'wallet-connect' });
      }
    }
  };

  const handleNewNote = () => {
    setIsExpanded(false);
    setShowCreateModal(true);
  };

  return (
      <>
          <CreateNoteModal 
            isOpen={showCreateModal} 
            onClose={() => setShowCreateModal(false)}
            onSuccess={onNoteCreated}
          />
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-4">
      {/* Expanded Buttons */}
      {isExpanded && (
        <div className="flex flex-col items-end gap-4">
          {/* New Note Button */}
          <button
            ref={newNoteButtonRef}
            onClick={handleNewNote}
            className="flex items-center justify-center gap-3 px-6 py-3 font-medium text-white transition-all duration-300 shadow-2xl bg-gradient-to-r from-brand-medium to-brand-light rounded-2xl hover:shadow-brand-light/50 hover:scale-105 animate-slide-in group w-[200px]"
          >
            <PlusIcon className="w-5 h-5 transition-transform group-hover:rotate-90" />
            <span>New Note</span>
          </button>

          {/* Wallet Button */}
          <button
            ref={walletButtonRef}
            onClick={handleWalletClick}
            disabled={loading}
            className={`flex items-center gap-3 px-6 py-3 font-medium transition-all duration-300 shadow-2xl rounded-2xl hover:scale-105 animate-slide-in group w-[200px] ${
              connected
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-red-500 hover:to-red-600 hover:shadow-red-500/50'
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
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <WalletIcon className="w-5 h-5" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-xs font-normal opacity-90 group-hover:hidden">Connected</span>
                  <span className="text-xs font-normal opacity-90 hidden group-hover:inline">Disconnect</span>
                  <span className="text-sm font-semibold">{truncateAddress(address, 4)}</span>
                </div>
              </>
            ) : (
              <>
                <WalletIcon className="w-5 h-5" />
                <span>Connect Wallet</span>
              </>
            )}
          </button>
        </div>
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
    </>
  );
};

export default FloatingActions;