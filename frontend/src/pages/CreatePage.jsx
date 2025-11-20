// src/pages/CreatePage.jsx - With REAL Blockchain Integration

import { ArrowLeftIcon } from 'lucide-react';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../lib/axios';
import NavigationBar from '../components/NavigationBar';
import { useWallet } from '../hooks/useWallet';
import { createNoteTransaction, checkBalance } from '../utils/cardano';

const CreatePage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [txStatus, setTxStatus] = useState(''); // Transaction status message
  const navigate = useNavigate();
  const { lucid, connected, address } = useWallet();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check wallet connection
    if (!connected || !lucid) {
      toast.error('Please connect your wallet first');
      return;
    }

    // Validate inputs
    if (!title.trim() || !content.trim()) {
      toast.error('All fields are required');
      return;
    }

    setLoading(true);

    try {
      // Generate unique note ID
      const noteId = `note_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Check if user has sufficient balance
      setTxStatus('Checking wallet balance...');
      const hasSufficientBalance = await checkBalance(lucid);
      
      if (!hasSufficientBalance) {
        throw new Error('Insufficient ADA balance. You need at least 1.5 ADA.');
      }

      // Step 1: Create blockchain transaction
      setTxStatus('Creating blockchain transaction...');
      console.log('Creating note on blockchain:', { noteId, title, content });

      const txHash = await createNoteTransaction(
        lucid,
        { noteId, title, content },
        'CREATE'
      );

      if (!txHash) {
        throw new Error('Transaction did not return a txHash');
      }

      console.log('Transaction successful! Hash:', txHash);
      setTxStatus('Transaction submitted to blockchain!');

      // Step 2: Save to backend with transaction hash
      setTxStatus('Saving note to database...');

      // Ensure backend receives wallet header even if localStorage isn't set
      const payload = { noteId, title, content, txHash, operation: 'CREATE' };
      const headers = {};
      if (address) headers['x-wallet-address'] = address;

      const res = await api.post('/notes', payload, { headers });
      console.log('Backend response:', res?.data);

      toast.success('Note created and recorded on blockchain! 🎉');
      setTxStatus('');
      
      // Navigate to home after short delay
      setTimeout(() => {
        navigate('/');
      }, 1500);

    } catch (error) {
      console.error('Error creating note:', error);
      setTxStatus('');

      // Handle specific error cases
      if (error.message?.includes('cancelled') || error.message?.includes('declined')) {
        toast.error('Transaction cancelled', { icon: '❌' });
      } else if (error.message?.includes('Insufficient')) {
        toast.error('Insufficient ADA balance. You need at least 1.5 ADA.', {
          duration: 5000
        });
      } else if (error.response?.status === 429) {
        toast.error("You're creating notes too fast", {
          duration: 4000,
          icon: '🤬',
        });
      } else {
        toast.error(error.message || 'Failed to create note');
      }
    } finally {
      setLoading(false);
    }
  };

  // Show wallet connection prompt if not connected
  if (!connected) {
    return (
      <div className="min-h-screen bg-base-200">
        <NavigationBar />
        <div className="container px-4 py-8 mx-auto">
          <div className="max-w-lg mx-auto">
            <div className="text-center shadow-xl card bg-base-100">
              <div className="card-body">
                <h2 className="justify-center mb-4 card-title">Wallet Required</h2>
                <p className="mb-6 text-base-content/70">
                  Please connect your Lace wallet to create notes on the blockchain
                </p>
                <div className="alert alert-info">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-6 h-6 stroke-current shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>
                    You'll need at least 1.5 ADA in your wallet to create notes
                  </span>
                </div>
                <div className="justify-center mt-4 card-actions">
                  <Link to="/" className="btn btn-primary">
                    Back to Home
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      <NavigationBar />
      <div className="container px-4 py-8 mx-auto">
        <div className="max-w-lg mx-auto">
          <Link to={'/'} className="inline-flex items-center gap-2 mb-6 btn btn-ghost">
            <ArrowLeftIcon className="w-5 h-5" />
            Back to Notes
          </Link>

          <div className="shadow-sm card card-compact bg-base-100">
            <div className="p-4">
              <h2 className="mb-3 text-xl font-semibold">Create New Note</h2>
              
              {/* Transaction Status */}
              {txStatus && (
                <div className="mb-4 alert alert-info">
                  <span className="loading loading-spinner loading-sm"></span>
                  <span>{txStatus}</span>
                </div>
              )}

              {/* Info about blockchain transaction */}
              <div className="mb-4 alert alert-warning">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 stroke-current shrink-0" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span className="text-sm">
                  Creating a note will send a transaction to the Cardano blockchain (~1 ADA + fees)
                </span>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-3 form-control">
                  <label className="label">
                    <span className="label-text">Title</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Note title"
                    className="w-full input input-bordered"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={loading}
                    maxLength={200}
                  />
                </div>

                <div className="mb-3 form-control">
                  <label className="label">
                    <span className="label-text">Content</span>
                  </label>
                  <textarea
                    placeholder="Write your note here"
                    className="w-full mb-3 h-28 textarea textarea-bordered"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    disabled={loading}
                  />
                  
                  <div className="justify-end card-actions">
                    <button 
                      type="submit" 
                      className="btn btn-primary" 
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="loading loading-spinner loading-sm"></span>
                          Creating on Blockchain...
                        </>
                      ) : (
                        'Create Note on Blockchain'
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Wallet Info */}
          <div className="mt-4 text-sm text-center text-base-content/60">
            Connected: {address?.substring(0, 12)}...{address?.substring(address.length - 8)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePage;