import React from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon, PlusCircleIcon, ArchiveIcon, Sparkles } from 'lucide-react';
import WalletConnect from './wallet/walletConnect'; // <--- UPDATED PATH
import { useWallet } from '../hooks/useWallet';

const NavigationBar = () => {
  const { balance, connected } = useWallet();

  return (
    <nav className="sticky top-0 z-40 border-b backdrop-blur-md relative" style={{ backgroundColor: 'rgba(27, 39, 65, 0.9)', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
      {connected && balance && (
        <div className="absolute top-2 right-4 text-xs text-white/80 px-2 py-1 rounded bg-white/5 z-50">
          {balance} ADA
        </div>
      )}
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <Link to="/" className="flex items-center gap-2 transition-opacity group hover:opacity-80">
            <Sparkles className="w-6 h-6 text-brand-lighter" />
            <span className="text-xl font-bold text-white">Jakwelin Notes</span>
          </Link>

          {/* Navigation Links + Wallet */}
          <div className="flex items-center gap-2 overflow-visible">
            <Link
              to="/"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-all rounded-lg hover:bg-white/10"
            >
              <HomeIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </Link>
            
            <Link
              to="/create"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-all rounded-lg bg-gradient-to-br from-brand-light to-brand-lighter hover:scale-105 hover:shadow-lg"
            >
              <PlusCircleIcon className="w-4 h-4" />
              <span className="hidden sm:inline">New Note</span>
            </Link>
            
            <Link
              to="/archived"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-all rounded-lg hover:bg-white/10"
            >
              <ArchiveIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Archived</span>
            </Link>

            {/* Divider */}
            <div className="h-8 w-px bg-white/10 mx-2" />

            {/* Wallet Connect Button */}
            <WalletConnect />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;