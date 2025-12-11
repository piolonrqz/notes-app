import React, { useState, useRef, useEffect } from 'react';
import { useWallet } from '../../hooks/useWallet'; // <--- FIXED: Go up 2 levels
import { BrowserWallet } from '@meshsdk/core';
import { Wallet, LogOut, Loader2 } from 'lucide-react';
import { getWalletIcon } from '../../utils/cardano';

const WalletConnect = () => {
    const { connected, address, connectWallet, disconnectWallet, connecting } = useWallet();
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    // Helper to shorten the address (e.g., addr1...xy123)
    const formatAddress = (addr) => {
        if (!addr) return '';
        return `${addr.slice(0, 10)}...${addr.slice(-6)}`;
    };

    // Get available wallets
    const getAvailableWallets = () => {
        try {
            const wallets = BrowserWallet.getInstalledWallets();
            return wallets.filter(w => ['lace', 'nami'].includes(w.name));
        } catch {   
            return [];
        }
    };

    // Handle click outside dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        if (showDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showDropdown]);

    // State: Connected
    if (connected && address) {
        return (
            <button
                onClick={disconnectWallet}
                className="group flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-lg bg-green-600 hover:bg-red-600 border border-green-500/50 hover:border-red-500/50 transition-all duration-200"
            >
                <div className="flex items-center gap-2">
                    {/* Status Dot */}
                    <div className="relative flex w-2 h-2">
                        <span className="absolute inline-flex w-full h-full bg-green-400 rounded-full opacity-75 animate-ping"></span>
                        <span className="relative inline-flex w-2 h-2 bg-green-500 rounded-full"></span>
                    </div>
                    <span className="text-xs font-mono font-medium text-white/90 group-hover:hidden">
                        {formatAddress(address)}
                    </span>
                    <span className="text-xs font-medium text-white hidden group-hover:inline">
                        Disconnect
                    </span>
                </div>
            </button>
        );
    }

    // State: Disconnected / Connecting
    const availableWallets = getAvailableWallets();

    return (
        <div ref={dropdownRef} className="relative">
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                disabled={connecting}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white transition-all rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20 active:scale-95"
            >
                {connecting ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Connecting...</span>
                    </>
                ) : (
                    <>
                        <Wallet className="w-4 h-4" />
                        <span>Connect Wallet</span>
                    </>
                )}
            </button>

            {showDropdown && !connecting && (
                <div className="absolute bottom-full mb-2 right-0 z-[60] bg-white/10 backdrop-blur-md border border-white/10 rounded-lg shadow-lg p-2 min-w-[160px]">
                    {availableWallets.length > 0 ? (
                        availableWallets.map((wallet) => (
                            <button
                                key={wallet.name}
                                onClick={() => {
                                    connectWallet(wallet.name);
                                    setShowDropdown(false);
                                }}
                                className="w-full text-left px-4 py-2 rounded-md hover:bg-white/10 text-white transition-all flex items-center gap-2"
                            >
                                <span>{getWalletIcon(wallet.name)}</span>
                                <span className="capitalize">{wallet.name}</span>
                            </button>
                        ))
                    ) : (
                        <div className="px-4 py-2 text-sm text-white/60">
                            No wallets installed
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default WalletConnect;