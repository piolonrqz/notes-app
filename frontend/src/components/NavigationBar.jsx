import { PlusIcon, ArchiveIcon, WalletIcon } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'
import { useWallet } from '../hooks/useWallet'

/**
 * Truncate Ethereum address for display
 */
const truncateAddress = (address, length = 6) => {
  if (!address) return '';
  return `${address.slice(0, length)}...${address.slice(-4)}`;
};

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
      <div className='p-4 mx-auto max-w-7xl'>
        <div className='flex items-center justify-between'>
          <Link to="/" className='font-mono text-3xl font-bold text-primary tracking-light hover:opacity-80'>
            Jakwelin Notes App
          </Link>
          
          <div className='flex items-center gap-3'>
            <Link to="/archived" className='btn btn-ghost btn-sm'>
              <ArchiveIcon className='w-4 h-4 mr-2'/> 
              <span>Archived</span>
            </Link>

            <Link to="/create" className='text-white transition-all border-0 btn btn-sm bg-gradient-to-r from-brand-medium to-brand-light hover:shadow-lg'>
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
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavigationBar;