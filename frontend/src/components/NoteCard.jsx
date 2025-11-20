// src/components/NoteCard.jsx - With Blockchain Integration

import { PenSquareIcon, Trash2Icon } from 'lucide-react';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { formatDate } from '../lib/utils';
import toast from 'react-hot-toast';
import api from '../lib/axios';
import { useWallet } from '../hooks/useWallet';
import { createNoteTransaction, checkBalance } from '../utils/cardano';

const NoteCard = ({ note, setNotes }) => {
  const navigate = useNavigate();
  const { lucid, connected } = useWallet();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();

    if (!connected || !lucid) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this note? This will cost ~1 ADA + fees.')) {
      return;
    }

    setDeleting(true);

    try {
      // Check balance
      const hasSufficientBalance = await checkBalance(lucid);
      if (!hasSufficientBalance) {
        throw new Error('Insufficient ADA balance. You need at least 1.5 ADA.');
      }

      // Create blockchain transaction
      toast.loading('Creating blockchain transaction...', { id: 'delete-tx' });
      
      const txHash = await createNoteTransaction(
        lucid,
        { noteId: note.noteId, title: note.title, content: 'Deleting note' },
        'DELETE'
      );

      toast.dismiss('delete-tx');
      console.log('Delete transaction successful:', txHash);

      // Delete from backend
      await api.delete(`/notes/${id}`, {
        data: { txHash, operation: 'DELETE' }
      });

      setNotes((prev) => prev.filter((n) => n._id !== id));
      toast.success('Note deleted successfully! 🗑️');

    } catch (error) {
      console.error('Error in delete operation:', error);
      toast.dismiss('delete-tx');

      if (error.message?.includes('cancelled') || error.message?.includes('declined')) {
        toast.error('Transaction cancelled');
      } else if (error.message?.includes('Insufficient')) {
        toast.error('Insufficient ADA balance', { duration: 5000 });
      } else {
        toast.error(error.message || 'Failed to delete note');
      }
    } finally {
      setDeleting(false);
    }
  };

  const handleEdit = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/notes/${id}/edit`);
  };

  return (
    <Link 
      to={`/notes/${note._id}`} 
      className={`transition-all duration-200 border-t-4 border-solid border-primary card bg-base-100 hover:shadow-lg ${deleting ? 'opacity-50 pointer-events-none' : ''}`}
    >
      <div className='rounded bg-primary card-body'>
        <h3 className='card-title text-base-content'>{note.title}</h3>
        <p className='text-base-content/70 line-clamp-3'>{note.content}</p>
        <div className='items-center justify-between mt-4 card-actions'>
          <span className='text-sm text-base-content/60'>
            {formatDate(new Date(note.createdAt))}
          </span>
          <div className='flex items-center gap-1'>
            <button 
              className='btn btn-primary btn-xs p-1'
              onClick={(e) => handleEdit(e, note._id)}
              disabled={deleting || !connected}
              title={!connected ? 'Connect wallet to edit' : 'Edit note'}
            >
              <PenSquareIcon className='w-4 h-4'/>
            </button>
            <button 
              className='btn btn-error btn-xs p-1'
              onClick={(e) => handleDelete(e, note._id)}
              disabled={deleting || !connected}
              title={!connected ? 'Connect wallet to delete' : 'Delete note'}
            >
              {deleting ? (
                <span className="loading loading-spinner loading-xs"></span>
              ) : (
                <Trash2Icon className='w-4 h-4' />
              )}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default NoteCard;