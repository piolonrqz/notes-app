// src/pages/EditPage.jsx - With Blockchain Integration

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavigationBar from '../components/NavigationBar';
import EditNote from '../components/notes/EditNote';
import Loading from '../components/common/Loading';
import { useWallet } from '../hooks/useWallet';
import { useNotes } from '../hooks/useNotes';
import toast from 'react-hot-toast';
import { useWallet } from '../hooks/useWallet';
import { createNoteTransaction, checkBalance } from '../utils/cardano';

const EditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
<<<<<<< HEAD
  const { wallet, address, connected } = useWallet();
  const { getNote, updateNote, loading: notesLoading } = useNotes(wallet, address);
  
  const [note, setNote] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(true);
=======
  const [note, setNote] = useState({ title: '', content: '', noteId: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [txStatus, setTxStatus] = useState('');
  const { lucid, connected, address } = useWallet();
>>>>>>> 5cf08634cd9da1fb0ababaca4565a4bc84a594a4

  useEffect(() => {
    const fetchNote = async () => {
      try {
<<<<<<< HEAD
        setFetchLoading(true);
        const data = await getNote(id);
        setNote(data);
=======
        const response = await api.get(`/notes/${id}`);
        const noteData = response.data.note || response.data;
        setNote(noteData);
        setLoading(false);
>>>>>>> 5cf08634cd9da1fb0ababaca4565a4bc84a594a4
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

<<<<<<< HEAD
  const handleSubmit = async (noteId, title, content) => {
    await updateNote(noteId, title, content);
=======
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!connected || !lucid) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!note.title.trim() || !note.content.trim()) {
      toast.error('Title and content are required');
      return;
    }

    setSaving(true);

    try {
      // Check balance
      setTxStatus('Checking wallet balance...');
      const hasSufficientBalance = await checkBalance(lucid);
      
      if (!hasSufficientBalance) {
        throw new Error('Insufficient ADA balance. You need at least 1.5 ADA.');
      }

      // Create blockchain transaction
      setTxStatus('Creating blockchain transaction...');
      const txHash = await createNoteTransaction(
        lucid,
        { noteId: note.noteId, title: note.title, content: note.content },
        'UPDATE'
      );

      console.log('Update transaction successful:', txHash);
      setTxStatus('Saving changes...');

      // Update in backend
      await api.put(`/notes/${id}`, {
        title: note.title,
        content: note.content,
        txHash,
        operation: 'UPDATE'
      });

      toast.success('Note updated successfully! 🎉');
      setTxStatus('');
      
      setTimeout(() => {
        navigate(`/notes/${id}`);
      }, 1500);

    } catch (error) {
      console.error('Error updating note:', error);
      setTxStatus('');

      if (error.message?.includes('cancelled') || error.message?.includes('declined')) {
        toast.error('Transaction cancelled');
      } else if (error.message?.includes('Insufficient')) {
        toast.error('Insufficient ADA balance', { duration: 5000 });
      } else {
        toast.error(error.message || 'Failed to update note');
      }
    } finally {
      setSaving(false);
    }
>>>>>>> 5cf08634cd9da1fb0ababaca4565a4bc84a594a4
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
<<<<<<< HEAD
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
=======
        <h1 className="mb-6 text-3xl font-bold">Edit Note</h1>

        {/* Transaction Status */}
        {txStatus && (
          <div className="alert alert-info mb-4">
            <span className="loading loading-spinner loading-sm"></span>
            <span>{txStatus}</span>
          </div>
        )}

        {/* Warning about blockchain transaction */}
        <div className="alert alert-warning mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span className="text-sm">
            Updating will send a transaction to the blockchain (~1 ADA + fees)
          </span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4 form-control">
            <label className="label">
              <span className="label-text">Title</span>
            </label>
            <input
              type="text"
              className="w-full input input-bordered"
              value={note.title}
              onChange={(e) => setNote({ ...note, title: e.target.value })}
              disabled={saving}
              required
              maxLength={200}
            />
          </div>
          <div className="mb-6 form-control">
            <label className="label">
              <span className="label-text">Content</span>
            </label>
            <textarea
              className="w-full h-64 textarea textarea-bordered"
              value={note.content}
              onChange={(e) => setNote({ ...note, content: e.target.value })}
              disabled={saving}
              required
            ></textarea>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => navigate(-1)}
              disabled={saving}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Saving on Blockchain...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>

        {/* Wallet Info */}
        <div className="mt-4 text-center text-sm text-base-content/60">
          Connected: {address?.substring(0, 12)}...{address?.substring(address.length - 8)}
        </div>
>>>>>>> 5cf08634cd9da1fb0ababaca4565a4bc84a594a4
      </div>
    </div>
  );
};

export default EditPage;
