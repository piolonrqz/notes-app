import { useState, useEffect, useCallback } from 'react';
import notesService from '../services/notesService';

/**
 * Hook to track pending transactions count and sync status
 */
export const usePendingTransactions = (address) => {
  const [pendingCount, setPendingCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchPendingCount = useCallback(async () => {
    if (!address) {
      setPendingCount(0);
      return;
    }

    setLoading(true);
    try {
      // Fetch notes and count pending ones
      const notes = await notesService.getAllNotes(address);
      const pending = Array.isArray(notes) 
        ? notes.filter(note => note.status === 'pending').length
        : 0;
      setPendingCount(pending);
      setIsSyncing(pending > 0);
    } catch (error) {
      console.error('Error fetching pending count:', error);
    } finally {
      setLoading(false);
    }
  }, [address]);

  // Auto-refresh every 10 seconds when there are pending transactions
  useEffect(() => {
    if (!address) return;

    fetchPendingCount();

    const interval = setInterval(() => {
      if (pendingCount > 0) {
        fetchPendingCount();
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [address, pendingCount, fetchPendingCount]);

  return {
    pendingCount,
    isSyncing,
    loading,
    refresh: fetchPendingCount,
  };
};

