import React from 'react';
import { ArrowLeftIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import NavigationBar from '../components/NavigationBar';
import CreateNote from '../components/notes/CreateNote';
import { useWallet } from '../hooks/useWallet';
import { useNotes } from '../hooks/useNotes';

const CreatePage = () => {
  const { wallet, address, connected } = useWallet();
  const { createNote, loading } = useNotes(wallet, address);

  const handleSubmit = async (title, content) => {
    await createNote(title, content);
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
