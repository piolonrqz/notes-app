import { useState, useCallback } from 'react';
import notesService from '../services/notesService';
import { createNoteTransaction } from '../utils/cardano';
import toast from 'react-hot-toast';

/**
 * Custom hook for notes CRUD operations with blockchain integration
 * @param {Object} wallet - Connected wallet from useWallet hook
 * @param {String} address - Wallet address
 * @returns {Object} Notes state and CRUD methods
 */
export const useNotes = (wallet, address) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch all notes
   */
  const fetchNotes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await notesService.getAllNotes(address);
      // Backend returns { ok, notes, count }
      const notesPayload = data?.notes ?? [];
      setNotes(notesPayload);
      return notesPayload;
    } catch (err) {
      setError(err.message);
      toast.error('Failed to fetch notes');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [address]);

  /**
   * Get single note by ID
   */
  const getNote = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      const data = await notesService.getNoteById(id);
      // Backend returns { ok, note }
      return data?.note ?? null;
    } catch (err) {
      setError(err.message);
      toast.error('Failed to fetch note');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Create new note with blockchain transaction
   */
  const createNote = useCallback(async (title, content) => {
    if (!wallet || !address) {
      toast.error('Please connect your wallet first');
      throw new Error('Wallet not connected');
    }

    try {
      setLoading(true);
      setError(null);

      // Generate unique note ID
      const noteId = `note_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const noteData = { noteId, title, content };

      // Step 1: Create blockchain transaction
      toast.loading('Creating blockchain transaction...', { id: 'create' });
      const txHash = await createNoteTransaction(wallet, noteData, 'CREATE');
      
      toast.loading('Transaction sent! Confirming...', { id: 'create' });

      // Step 2: Send to backend with tx hash
      const result = await notesService.createNote(
        { ...noteData, txHash },
        address
      );

      // Backend returns { ok, note, message }
      const created = result?.note ?? result;

      // Update local state
      setNotes(prev => [created, ...prev]);

      toast.success('Note created successfully!', { id: 'create' });
      return created;
    } catch (err) {
      setError(err.message);
      toast.error(`Failed to create note: ${err.message}`, { id: 'create' });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [wallet, address]);

  /**
   * Update existing note with blockchain transaction
   */
  const updateNote = useCallback(async (id, title, content) => {
    if (!wallet || !address) {
      toast.error('Please connect your wallet first');
      throw new Error('Wallet not connected');
    }

    try {
      setLoading(true);
      setError(null);

      const noteData = { noteId: id, title, content };

      // Step 1: Create blockchain transaction
      toast.loading('Creating blockchain transaction...', { id: 'update' });
      const txHash = await createNoteTransaction(wallet, noteData, 'UPDATE');
      
      toast.loading('Transaction sent! Confirming...', { id: 'update' });

      // Step 2: Update in backend with tx hash
      const result = await notesService.updateNote(
        id,
        { title, content, txHash },
        address
      );

      const updated = result?.note ?? result;

      // Update local state
      setNotes(prev => prev.map(note => note._id === id ? updated : note));

      toast.success('Note updated successfully!', { id: 'update' });
      return updated;
    } catch (err) {
      setError(err.message);
      toast.error(`Failed to update note: ${err.message}`, { id: 'update' });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [wallet, address]);

  /**
   * Delete note with blockchain transaction
   */
  const deleteNote = useCallback(async (id) => {
    if (!wallet || !address) {
      toast.error('Please connect your wallet first');
      throw new Error('Wallet not connected');
    }

    try {
      setLoading(true);
      setError(null);

      const noteData = { noteId: id, title: 'Delete', content: 'Deleting note' };

      // Step 1: Create blockchain transaction
      toast.loading('Creating blockchain transaction...', { id: 'delete' });
      const txHash = await createNoteTransaction(wallet, noteData, 'DELETE');
      
      toast.loading('Transaction sent! Confirming...', { id: 'delete' });

      // Step 2: Delete in backend with tx hash
      const result = await notesService.deleteNote(id, txHash, address);

      const deleted = result?.note ?? null;

      // Update local state - remove by id
      setNotes(prev => prev.filter(note => note._id !== id));

      toast.success('Note deleted successfully!', { id: 'delete' });
    } catch (err) {
      setError(err.message);
      toast.error(`Failed to delete note: ${err.message}`, { id: 'delete' });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [wallet, address]);

  /**
   * Archive note (local operation, no blockchain)
   */
  const archiveNote = useCallback(async (id) => {
    if (!address) {
      toast.error('Please connect your wallet first');
      throw new Error('Wallet not connected');
    }

    try {
      setLoading(true);
      const result = await notesService.archiveNote(id, address);
      const archived = result?.note ?? result;
      setNotes(prev => prev.filter(note => note._id !== id));
      toast.success('Note archived');
      return archived;
    } catch (err) {
      setError(err.message);
      toast.error('Failed to archive note');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [address]);

  /**
   * Unarchive note (local operation, no blockchain)
   */
  const unarchiveNote = useCallback(async (id) => {
    if (!address) {
      toast.error('Please connect your wallet first');
      throw new Error('Wallet not connected');
    }

    try {
      setLoading(true);
      const result = await notesService.unarchiveNote(id, address);
      const unarchived = result?.note ?? result;
      toast.success('Note unarchived');
      return unarchived;
    } catch (err) {
      setError(err.message);
      toast.error('Failed to unarchive note');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [address]);

  return {
    notes,
    loading,
    error,
    fetchNotes,
    getNote,
    createNote,
    updateNote,
    deleteNote,
    archiveNote,
    unarchiveNote,
    setNotes
  };
};

