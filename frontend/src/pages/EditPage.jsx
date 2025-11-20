// src/pages/EditPage.jsx - With Blockchain Integration

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavigationBar from '../components/NavigationBar';
import EditNote from '../components/notes/EditNote';
import Loading from '../components/common/Loading';
import { useWallet } from '../hooks/useWallet';
import { useNotes } from '../hooks/useNotes';
import toast from 'react-hot-toast';
import { createNoteTransaction, checkBalance } from '../utils/cardano';

const EditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { wallet, address, connected } = useWallet();
  const { getNote, updateNote, loading: notesLoading } = useNotes(wallet, address);
  
  const [note, setNote] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        setFetchLoading(true);
        const data = await getNote(id);
        setNote(data);
      } catch (error) {
        console.error('Error fetching note:', error);
        toast.error('Failed to load note');
        navigate('/');
      } finally {
        setFetchLoading(false);
      }
    };

    fetchNote();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleSubmit = async (noteId, title, content) => {
    await updateNote(noteId, title, content);
  };

  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-base-200">
        <NavigationBar />
        <Loading text="Loading note..." fullScreen />
      </div>
    );
  }

  if (!connected) {
    return (
      <div className="min-h-screen bg-base-200">
        <NavigationBar />
        <div className="container px-4 py-8 mx-auto text-center">
          <h2 className="mb-4 text-2xl">Connect Wallet Required</h2>
          <p className="text-base-content/70">
            Please connect your wallet to edit notes
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      <NavigationBar />
      
      <div className="max-w-4xl p-4 mx-auto">
        <div className="shadow-lg card bg-base-100">
          <div className="card-body">
            <h1 className="mb-6 text-3xl font-bold">Edit Note</h1>
            
            <EditNote
              note={note}
              onSubmit={handleSubmit}
              loading={notesLoading}
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
                Updating a note will record a transaction on the Cardano blockchain.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditPage;
