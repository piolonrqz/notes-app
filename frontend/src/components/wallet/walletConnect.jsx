import React from 'react';
import { useWallet } from '../../hooks/useWallet'; // <--- FIXED: Go up 2 levels
import { Wallet, LogOut, Loader2 } from 'lucide-react';

const WalletConnect = () => {
    const { connected, address, connectWallet, disconnectWallet, connecting } = useWallet();

    // Helper to shorten the address (e.g., addr1...xy123)
    const formatAddress = (addr) => {
        if (!addr) return '';
        return `${addr.slice(0, 10)}...${addr.slice(-6)}`;
    };

    // State: Connected
    if (connected && address) {
        return (
            <div className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-lg bg-white/10 border border-white/10">
                <div className="flex items-center gap-2">
                    {/* Status Dot */}
                    <div className="relative flex w-2 h-2">
                        <span className="absolute inline-flex w-full h-full bg-green-400 rounded-full opacity-75 animate-ping"></span>
                        <span className="relative inline-flex w-2 h-2 bg-green-500 rounded-full"></span>
                    </div>
                    <span className="text-xs font-mono font-medium text-white/90">
            {formatAddress(address)}
          </span>
                </div>

                <div className="w-px h-4 mx-1 bg-white/20" />

                <button
                    onClick={disconnectWallet}
                    className="p-1.5 text-white/60 hover:text-red-400 hover:bg-white/10 rounded-md transition-all"
                    title="Disconnect Wallet"
                >
                    <LogOut size={14} />
                </button>
            </div>
        );
    }

    // State: Disconnected / Connecting
    return (
        <button
            onClick={() => connectWallet('lace')} // Defaults to Lace
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
    );
};

export default WalletConnect;