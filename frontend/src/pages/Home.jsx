import React, { useEffect, useState } from 'react';
import NoteBentoGrid from '../components/notes/NoteBentoGrid';
import BentoHeader from '../components/common/BentoHeader';
import BentoFilterBar from '../components/filters/BentoFilterBar';
import FloatingActions from '../components/common/FloatingActions';
import NoteDetailSlideOver from '../components/notes/NoteDetailSlideOver';
import DeleteNote from '../components/notes/DeleteNote';
import EditNoteModal from '../components/notes/EditNoteModal';
import RateLimitedUI from '../components/RateLimitedUI';
import { useWallet } from '../hooks/useWallet';
import { useNotes } from '../hooks/useNotes';
import { useSearch } from '../hooks/useSearch';
import { usePendingTransactions } from '../hooks/usePendingTransactions';
import toast from 'react-hot-toast';

const Home = () => {
  const { wallet, address, connected } = useWallet();
  const { notes, loading, fetchNotes, deleteNote, updateNote, setNotes } = useNotes(wallet, address);
  const { refresh: refreshPendingCount } = usePendingTransactions(address);

  // Clear notes when wallet disconnects
  useEffect(() => {
    if (!connected) {
      setNotes([]);
      setSelectedNote(null);
      setShowNoteDetail(false);
    }
  }, [connected, setNotes]);

  // --- FIX: Smart Unwrapping of Backend Response ---
  // This looks inside the object to find where the array is hiding
  const realNotes = (() => {
    if (!connected || !notes) return [];
    if (Array.isArray(notes)) return notes;
    if (notes.data && Array.isArray(notes.data)) return notes.data;
    if (notes.notes && Array.isArray(notes.notes)) return notes.notes; // Common backend pattern
    if (notes.result && Array.isArray(notes.result)) return notes.result;
    return [];
  })();

  // Debug log to see exactly what the backend sent
  useEffect(() => {
    if (notes && !Array.isArray(notes)) {
      console.log('🔍 DEBUG: Backend returned this structure:', notes);
    }
  }, [notes]);

  const {
    searchQuery,
    sortBy,
    filterBy,
    filteredNotes,
    handleSearch,
    handleSort,
    handleFilter,
  } = useSearch(realNotes);

  const [isRateLimited, setIsRateLimited] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, note: null });
  const [deleting, setDeleting] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [showNoteDetail, setShowNoteDetail] = useState(false);
  const [editModal, setEditModal] = useState({ isOpen: false, note: null });

  // Reload notes whenever the wallet address becomes available
  useEffect(() => {
    if (address) {
      fetchNotes().catch(error => {
        console.error('Fetch error:', error);
        if (error.response?.status === 429) setIsRateLimited(true);
      });
      refreshPendingCount();
    }
  }, [address, fetchNotes, refreshPendingCount]);

  const handleDeleteClick = (noteId) => {
    const noteToDelete = realNotes.find(n => n._id === noteId);
    setDeleteModal({ isOpen: true, note: noteToDelete });
  };

  const handleEditClick = (noteId) => {
    const noteToEdit = realNotes.find(n => n._id === noteId);
    if (noteToEdit) {
      setEditModal({ isOpen: true, note: noteToEdit });
    }
  };

  const handleConfirmDelete = async (noteId) => {
    try {
      setDeleting(true);
      await deleteNote(noteId);
      setDeleteModal({ isOpen: false, note: null });
    } catch (error) {
      console.error('Delete error:', error);
    } finally {
      setDeleting(false);
    }
  };

  const handleNoteClick = (note) => {
    if (!connected) {
      toast.error('Please connect your wallet to view notes');
      return;
    }
    setSelectedNote(note);
    setShowNoteDetail(true);
  };

  const handleCloseDetail = () => {
    setShowNoteDetail(false);
    setTimeout(() => setSelectedNote(null), 300);
  };

  const handleDeleteFromDetail = async (noteId) => {
    await deleteNote(noteId);
    handleCloseDetail();
  };

  const handleUpdateNote = async (noteId, title, content) => {
    try {
      await updateNote(noteId, title, content);
      if (selectedNote?._id === noteId) {
        const updatedNote = realNotes.find(n => n._id === noteId);
        if (updatedNote) {
          setSelectedNote({ ...updatedNote, title, content });
        }
      }
      await fetchNotes();
    } catch (error) {
      console.error('Error updating note:', error);
      throw error;
    }
  };

  const stats = {
    total: realNotes.length,
    thisWeek: realNotes.filter(n => {
      if (!n.createdAt) return false;
      const noteDate = new Date(n.createdAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return noteDate >= weekAgo;
    }).length
  };

  return (
    <div className="min-h-screen bg-[#1B2741]">
      {/* --- DEBUG BOX (Green text for verification) ---
      <div className="fixed bottom-4 left-4 z-50 p-4 bg-black/80 text-green-400 font-mono text-xs rounded border border-green-500/30 pointer-events-none">
        <p>Wallet: {connected ? 'Connected' : 'Disconnected'}</p>
        <p>Raw Type: {Array.isArray(notes) ? 'Array' : typeof notes}</p>
        <p>Real Notes Found: {realNotes.length}</p>
        <p>Filtered Notes: {filteredNotes.length}</p>
      </div> */}

      {isRateLimited && <RateLimitedUI />}

      <div className="px-4 py-8 mx-auto max-w-7xl md:px-8">
        {!isRateLimited && (
          <BentoHeader 
            title="Jakwelin Notes" 
            subtitle="Organize your thoughts, powered by blockchain"
            stats={stats}
          />
        )}

        {!isRateLimited && (
          <BentoFilterBar
            searchQuery={searchQuery}
            onSearchChange={handleSearch}
            sortBy={sortBy}
            onSortChange={handleSort}
            filterBy={filterBy}
            onFilterChange={handleFilter}
            resultsCount={filteredNotes.length}
          />
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="mb-4 loading loading-spinner loading-lg text-brand-lighter"></div>
              <p className="text-gray-400">Loading your notes...</p>
            </div>
          </div>
        )}

        {/* Empty State / Grid */}
        {!isRateLimited && !loading && (
          connected && filteredNotes.length > 0 ? (
            <NoteBentoGrid
              notes={filteredNotes}
              onDelete={handleDeleteClick}
              onEdit={handleEditClick}
              onNoteClick={handleNoteClick}
            />
          ) : (
            <div className="text-center py-20 text-gray-400">
              <p className="text-xl">No notes found.</p>
              {!connected && <p className="text-sm mt-2 text-yellow-400">Please connect your wallet to view notes.</p>}
              {connected && <p className="text-sm mt-2">Create a new note to get started!</p>}
              
              {/* Extra Debug Info for you */}
              {connected && realNotes.length === 0 && (
                 <p className="mt-4 text-xs text-gray-600">
                   If you just created a note, it might still be confirming on the blockchain.
                 </p>
              )}
            </div>
          )
        )}
      </div>

      <FloatingActions onNoteCreated={fetchNotes} />

      <DeleteNote
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, note: null })}
        onConfirm={handleConfirmDelete}
        note={deleteModal.note}
        loading={deleting}
      />

      <EditNoteModal
        isOpen={editModal.isOpen}
        note={editModal.note}
        onClose={() => setEditModal({ isOpen: false, note: null })}
        onUpdate={handleUpdateNote}
      />

      <NoteDetailSlideOver
        note={selectedNote}
        isOpen={showNoteDetail && connected}
        onClose={handleCloseDetail}
        onDelete={handleDeleteFromDetail}
        onArchive={() => {
          toast.success('Note archived!');
          handleCloseDetail();
        }}
        onUpdate={handleUpdateNote}
      />
    </div>
  );
};

export default Home;