// src/components/WalletConnect.jsx - REAL Lace Integration

import React from 'react';
import { useWallet } from '../hooks/useWallet';
import { Wallet, ExternalLink, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const WalletConnect = () => {
  const { 
    address, 
    connected, 
    loading, 
    error,
    connectWallet, 
    disconnectWallet,
    isLaceInstalled 
  } = useWallet();

  const handleConnect = async () => {
    try {
      await connectWallet();
      toast.success('Wallet connected successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to connect wallet');
    }
  };

  // If Lace is not installed
  if (!isLaceInstalled && !connected) {
    return (
      <div className="flex items-center gap-2">
        <div className="tooltip tooltip-bottom" data-tip="Lace wallet not found">
          <button
            onClick={() => window.open('https://www.lace.io/', '_blank')}
            className="btn btn-warning btn-sm"
          >
            <AlertCircle className="w-4 h-4 mr-2" />
            Install Lace
            <ExternalLink className="w-3 h-3 ml-1" />
          </button>
        </div>
      </div>
    );
  }

  // If wallet is connected
  if (connected) {
    return (
      <div className="flex items-center gap-2">
        <div className="badge badge-success gap-2">
          <Wallet className="w-4 h-4" />
          Connected
        </div>
        <div className="hidden sm:block">
          <div className="text-xs text-base-content/60 font-mono">
            {address?.substring(0, 12)}...{address?.substring(address.length - 8)}
          </div>
        </div>
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-xs">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 stroke-current">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </label>
          <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
            <li>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(address);
                  toast.success('Address copied!');
                }}
              >
                Copy Address
              </button>
            </li>
            <li>
              <button 
                onClick={disconnectWallet}
                className="text-error"
              >
                Disconnect
              </button>
            </li>
          </ul>
        </div>
      </div>
    );
  }

  // If wallet is not connected
  return (
    <button
      onClick={handleConnect}
      disabled={loading}
      className="btn btn-primary btn-sm"
    >
      {loading ? (
        <>
          <span className="loading loading-spinner loading-xs"></span>
          Connecting...
        </>
      ) : (
        <>
          <Wallet className="w-4 h-4 mr-2" />
          Connect Lace
        </>
      )}
    </button>
  );
};

export default WalletConnect;