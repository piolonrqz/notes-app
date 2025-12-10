import { useState, useCallback, useEffect } from 'react';
import notesService from '../services/notesService';
import toast from 'react-hot-toast';

/**
 * Hook for managing transaction status updates
 * @param {String} txHash - Transaction hash to monitor
 * @param {Object} options - Options for polling
 * @param {Boolean} options.autoPoll - Automatically poll for status updates (default: false)
 * @param {Number} options.pollInterval - Polling interval in milliseconds (default: 10000)
 * @returns {Object} Status state and update functions
 */
export const useTransactionStatus = (txHash, options = {}) => {
  const { autoPoll = false, pollInterval = 10000 } = options;
  
  const [status, setStatus] = useState('pending');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [note, setNote] = useState(null);

  /**
   * Update transaction status manually
   * @param {String} newStatus - New status: 'pending', 'confirmed', or 'failed'
   * @param {Number} blockHeight - Optional block height
   * @param {String} blockTime - Optional block time
   */
  const updateStatus = useCallback(async (newStatus, blockHeight = null, blockTime = null) => {
    if (!txHash) {
      setError('Transaction hash is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await notesService.updateTransactionStatus(
        txHash,
        newStatus,
        blockHeight,
        blockTime
      );
      
      setStatus(newStatus);
      setNote(response.note || response.data?.note);
      
      toast.success(`Transaction status updated to ${newStatus}`);
      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to update status';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [txHash]);

  /**
   * Fetch current note status by fetching the note
   * @param {String} noteId - Note ID to fetch
   */
  const refreshStatus = useCallback(async (noteId) => {
    if (!noteId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await notesService.getNoteById(noteId);
      const noteData = response.note || response.data || response;
      
      if (noteData.status) {
        setStatus(noteData.status);
      }
      if (noteData) {
        setNote(noteData);
      }
      
      return noteData;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to fetch status';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-polling effect
  useEffect(() => {
    if (!autoPoll || !txHash || status === 'confirmed' || status === 'failed') {
      return;
    }

    const interval = setInterval(async () => {
      try {
        // If we have a note, refresh its status
        if (note?._id || note?.noteId) {
          await refreshStatus(note._id || note.noteId);
        }
      } catch (err) {
        console.error('Error polling transaction status:', err);
      }
    }, pollInterval);

    return () => clearInterval(interval);
  }, [autoPoll, txHash, status, note, pollInterval, refreshStatus]);

  return {
    status,
    loading,
    error,
    note,
    updateStatus,
    refreshStatus,
  };
};

export default useTransactionStatus;

