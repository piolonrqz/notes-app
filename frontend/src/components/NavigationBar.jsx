<<<<<<< HEAD
import { PlusIcon, ArchiveIcon, WalletIcon } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'
import { useWallet } from '../hooks/useWallet'
import { truncateAddress } from '../utils/cardano'
=======
import { PlusIcon } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';
import WalletConnect from './WalletConnect';
>>>>>>> 5cf08634cd9da1fb0ababaca4565a4bc84a594a4

const NavigationBar = () => {
  const { connected, address, connectWallet, disconnectWallet, loading } = useWallet()

  const handleWalletClick = async () => {
    if (connected) {
      disconnectWallet()
    } else {
      try {
        await connectWallet()
      } catch (error) {
        console.error('Wallet connection error:', error)
      }
    }
  }

  return (
    <header className='border-b bg-[#1B2741]/50 backdrop-blur-md border-brand-light/10'>
      <div className='max-w-7xl p-4 mx-auto'>
        <div className='flex items-center justify-between'>
<<<<<<< HEAD
          <Link to="/" className='font-mono text-3xl font-bold text-primary tracking-light hover:opacity-80'>
            Jakwelin Notes App
          </Link>
          
          <div className='flex items-center gap-3'>
            <Link to="/archived" className='btn btn-ghost btn-sm'>
              <ArchiveIcon className='w-4 h-4 mr-2'/> 
              <span>Archived</span>
            </Link>

            <Link to="/create" className='btn btn-sm bg-gradient-to-r from-brand-medium to-brand-light border-0 text-white hover:shadow-lg transition-all'>
              <PlusIcon className='w-4 h-4 mr-2'/> 
              <span>New Note</span>
            </Link>

            <button 
              className={`btn btn-sm ${connected ? 'bg-gradient-to-r from-brand-medium to-brand-light border-0 text-white hover:shadow-lg' : 'bg-brand-lighter/20 text-brand-dark border border-brand-light/30 hover:bg-brand-lighter/30'}`}
              onClick={handleWalletClick}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Connecting...
                </>
              ) : connected ? (
                <>
                  <WalletIcon className='w-4 h-4 mr-2'/>
                  {truncateAddress(address, 6)}
                </>
              ) : (
                <>
                  <WalletIcon className='w-4 h-4 mr-2'/>
                  Connect Wallet
                </>
              )}
            </button>
=======
          <h1 className='font-mono text-3xl font-bold text-primary tracking-light'>
            Jakwelin Notes App
          </h1>
          <div className='flex items-center gap-4'>
            <WalletConnect />
            <Link to={"/create"} className='btn btn-primary'>
              <PlusIcon className='w-5 h-5 mr-2'/> 
              <span>New Note</span>
            </Link>
>>>>>>> 5cf08634cd9da1fb0ababaca4565a4bc84a594a4
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavigationBar;