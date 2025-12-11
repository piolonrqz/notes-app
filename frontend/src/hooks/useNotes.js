import { useState, useCallback, useEffect } from 'react';
import notesService from '../services/notesService';
import { createNoteTransaction } from '../utils/cardano';
import { useWallet } from './useWallet';
import toast from 'react-hot-toast';

export const useNotes = (wallet, address) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [transactionStage, setTransactionStage] = useState(null);
  const [txHash, setTxHash] = useState(null);
  const { refreshBalance } = useWallet();

  // Fetch all notes
  const fetchNotes = useCallback(async () => {
    if (!address) return;
    setLoading(true);
    try {
      const data = await notesService.getAllNotes(address);
      // Unwrap backend response - handle different response formats
      let notesArray = [];
      if (Array.isArray(data)) {
        notesArray = data;
      } else if (data && Array.isArray(data.data)) {
        notesArray = data.data;
      } else if (data && Array.isArray(data.notes)) {
        notesArray = data.notes;
      } else if (data && Array.isArray(data.result)) {
        notesArray = data.result;
      }
      setNotes(notesArray);
    } catch (error) {
      console.error('Error fetching notes:', error);
      setNotes([]); // Set to empty array on error
    } finally {
      setLoading(false);
    }
  }, [address]);

  // Get single note
  const getNote = useCallback(async (id) => {
    return await notesService.getNoteById(id);
  }, []);

  // Refresh balance when transaction is confirmed
  useEffect(() => {
    if (transactionStage === 'confirmed' && refreshBalance) {
      // Small delay to ensure blockchain has updated
      setTimeout(() => {
        refreshBalance();
      }, 2000);
    }
  }, [transactionStage, refreshBalance]);

  // Create Note: Blockchain -> Backend
  const createNote = useCallback(async (title, content) => {
    if (!wallet || !address) {
      toast.error('Wallet not connected');
      return;
    }

    setLoading(true);
    setTransactionStage('building');
    setTxHash(null);
    const toastId = toast.loading('Building transaction...');

    try {
      // 1. Generate a Unique ID for the note
      const noteId = crypto.randomUUID(); 

      // 2. Create Transaction on Blockchain (Include noteId in metadata)
      setTransactionStage('signing');
      toast.loading('Signing transaction...', { id: toastId });
      
      setTransactionStage('submitting');
      toast.loading('Submitting to blockchain...', { id: toastId });
      
      const hash = await createNoteTransaction(
        wallet, 
        { noteId, title, content }, 
        'CREATE'
      );
      
      setTxHash(hash);
      setTransactionStage('confirming');
      toast.loading('Waiting for confirmation...', { id: toastId });

      // 3. Save to Backend (Include noteId to fix validation error)
      const newNote = await notesService.createNote(
        { noteId, title, content, txHash: hash }, 
        address
      );

      setNotes(prev => {
        const prevArray = Array.isArray(prev) ? prev : [];
        return [newNote, ...prevArray];
      });
      setTransactionStage('confirmed');
      toast.success('Note created successfully!', { id: toastId });
      
      // Reset after a delay
      setTimeout(() => {
        setTransactionStage(null);
        setTxHash(null);
      }, 3000);
      
      return newNote;

    } catch (error) {
      console.error('Create note failed:', error);
      setTransactionStage('failed');
      // Extract nice error message if possible
      const message = error.response?.data?.error || error.message || 'Failed to create note';
      toast.error(message, { id: toastId });
      setTimeout(() => {
        setTransactionStage(null);
        setTxHash(null);
      }, 3000);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [wallet, address]);

  // Update Note
  const updateNote = useCallback(async (id, title, content) => {
    setLoading(true);
    setTransactionStage('building');
    setTxHash(null);
    const toastId = toast.loading('Building transaction...');

    try {
      setTransactionStage('signing');
      toast.loading('Signing transaction...', { id: toastId });
      
      setTransactionStage('submitting');
      toast.loading('Submitting to blockchain...', { id: toastId });
      
      // 1. Record Update on Blockchain
      const hash = await createNoteTransaction(wallet, { noteId: id, title, content }, 'UPDATE');
      
      setTxHash(hash);
      setTransactionStage('confirming');
      toast.loading('Waiting for confirmation...', { id: toastId });

      // 2. Update Backend
      const updatedNote = await notesService.updateNote(
        id, 
        { title, content, txHash: hash }, 
        address
      );

      setNotes(prev => {
        const prevArray = Array.isArray(prev) ? prev : [];
        return prevArray.map(n => n._id === id ? updatedNote : n);
      });
      setTransactionStage('confirmed');
      toast.success('Note updated!', { id: toastId });
      
      setTimeout(() => {
        setTransactionStage(null);
        setTxHash(null);
      }, 3000);

    } catch (error) {
      console.error('Update failed:', error);
      setTransactionStage('failed');
      toast.error('Failed to update note', { id: toastId });
      setTimeout(() => {
        setTransactionStage(null);
        setTxHash(null);
      }, 3000);
    } finally {
      setLoading(false);
    }
  }, [wallet, address]);

  // Delete Note
  const deleteNote = useCallback(async (id) => {
    setLoading(true);
    const toastId = toast.loading('Deleting from blockchain...');

    try {
      // 1. Record Deletion on Blockchain
      const txHash = await createNoteTransaction(wallet, { noteId: id }, 'DELETE');

      // 2. Delete from Backend
      await notesService.deleteNote(id, txHash, address);

      setNotes(prev => {
        const prevArray = Array.isArray(prev) ? prev : [];
        return prevArray.filter(n => n._id !== id);
      });
      toast.success('Note deleted!', { id: toastId });
      
      // Refresh balance after deletion
      if (refreshBalance) {
        setTimeout(() => {
          refreshBalance();
        }, 2000);
      }

    } catch (error) {
      console.error('Delete failed:', error);
      toast.error('Failed to delete note', { id: toastId });
    } finally {
      setLoading(false);
    }
  }, [wallet, address, refreshBalance]);

  return {
    notes,
    loading,
    transactionStage,
    txHash,
    fetchNotes,
    getNote,
    createNote,
    updateNote,
    deleteNote,
    setNotes
  };
};