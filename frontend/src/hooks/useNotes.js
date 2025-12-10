import { useState, useCallback } from 'react';
import notesService from '../services/notesService';
import { createNoteTransaction } from '../utils/cardano';
import toast from 'react-hot-toast';

export const useNotes = (wallet, address) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all notes
  const fetchNotes = useCallback(async () => {
    if (!address) return;
    setLoading(true);
    try {
      const data = await notesService.getAllNotes(address);
      setNotes(data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  }, [address]);

  // Get single note
  const getNote = useCallback(async (id) => {
    return await notesService.getNoteById(id);
  }, []);

  // Create Note: Blockchain -> Backend
  const createNote = useCallback(async (title, content) => {
    if (!wallet || !address) {
      toast.error('Wallet not connected');
      return;
    }

    setLoading(true);
    const toastId = toast.loading('Creating note on blockchain...');

    try {
      // 1. Generate a Unique ID for the note
      const noteId = crypto.randomUUID(); 

      // 2. Create Transaction on Blockchain (Include noteId in metadata)
      const txHash = await createNoteTransaction(
        wallet, 
        { noteId, title, content }, 
        'CREATE'
      );
      
      toast.loading('Syncing with database...', { id: toastId });

      // 3. Save to Backend (Include noteId to fix validation error)
      const newNote = await notesService.createNote(
        { noteId, title, content, txHash }, 
        address
      );

      setNotes(prev => [newNote, ...prev]);
      toast.success('Note created successfully!', { id: toastId });
      return newNote;

    } catch (error) {
      console.error('Create note failed:', error);
      // Extract nice error message if possible
      const message = error.response?.data?.error || error.message || 'Failed to create note';
      toast.error(message, { id: toastId });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [wallet, address]);

  // Update Note
  const updateNote = useCallback(async (id, title, content) => {
    setLoading(true);
    const toastId = toast.loading('Updating note on blockchain...');

    try {
      // 1. Record Update on Blockchain
      const txHash = await createNoteTransaction(wallet, { noteId: id, title, content }, 'UPDATE');

      // 2. Update Backend
      const updatedNote = await notesService.updateNote(
        id, 
        { title, content, txHash }, 
        address
      );

      setNotes(prev => prev.map(n => n._id === id ? updatedNote : n));
      toast.success('Note updated!', { id: toastId });

    } catch (error) {
      console.error('Update failed:', error);
      toast.error('Failed to update note', { id: toastId });
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

      setNotes(prev => prev.filter(n => n._id !== id));
      toast.success('Note deleted!', { id: toastId });

    } catch (error) {
      console.error('Delete failed:', error);
      toast.error('Failed to delete note', { id: toastId });
    } finally {
      setLoading(false);
    }
  }, [wallet, address]);

  return {
    notes,
    loading,
    fetchNotes,
    getNote,
    createNote,
    updateNote,
    deleteNote,
    setNotes
  };
};