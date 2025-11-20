import React from 'react';
import { ArrowLeftIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import NavigationBar from '../components/NavigationBar';
import CreateNote from '../components/notes/CreateNote';
import { useWallet } from '../hooks/useWallet';
import { useNotes } from '../hooks/useNotes';
import toast from 'react-hot-toast';

const CreatePage = () => {
  const { wallet, address, connected } = useWallet();
  const { createNote, loading } = useNotes(wallet, address);
  const navigate = useNavigate();

  const handleSubmit = async (title, content) => {
    // Add validation before attempting to create
    if (!connected || !wallet || !address) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      await createNote(title, content);
      // Navigate back to home after successful creation
      navigate('/');
    } catch (error) {
      console.error('Create note error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      <NavigationBar />
      
      <div className="container px-4 py-8 mx-auto">
        <div className="max-w-2xl mx-auto">
          {/* Back Button */}
          <Link to="/" className="inline-flex items-center gap-2 mb-6 btn btn-ghost">
            <ArrowLeftIcon className="w-5 h-5" />
            Back to Notes
          </Link>

          {/* Wallet Not Connected Warning */}
          {!connected && (
            <div className="mb-6 shadow-lg alert alert-warning">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="flex-shrink-0 w-6 h-6 stroke-current"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <div>
                  <h3 className="font-bold">Wallet Not Connected</h3>
                  <div className="text-xs">Please connect your wallet to create notes on the blockchain.</div>
                </div>
              </div>
            </div>
          )}

          {/* Create Note Form */}
          <div className="shadow-lg card bg-base-100">
            <div className="card-body">
              <h2 className="mb-4 text-2xl font-bold card-title">Create New Note</h2>
              
              <CreateNote
                onSubmit={handleSubmit}
                loading={loading}
                walletConnected={connected}
              />
            </div>
          </div>

          {/* Info Alert */}
          {connected && (
            <div className="mt-4 alert alert-info">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="flex-shrink-0 w-6 h-6 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <span>
                  Creating a note will record a transaction on the Cardano blockchain.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatePage;