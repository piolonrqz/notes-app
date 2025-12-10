import React, { useEffect, useState } from 'react';
import NoteBentoGrid from '../components/notes/NoteBentoGrid';
import BentoHeader from '../components/common/BentoHeader';
import BentoFilterBar from '../components/filters/BentoFilterBar';
import FloatingActions from '../components/common/FloatingActions';
import NoteDetailSlideOver from '../components/notes/NoteDetailSlideOver';
import DeleteNote from '../components/notes/DeleteNote';
import RateLimitedUI from '../components/RateLimitedUI';
import { useWallet } from '../hooks/useWallet';
import { useNotes } from '../hooks/useNotes';
import { useSearch } from '../hooks/useSearch';
import toast from 'react-hot-toast';

const Home = () => {
  const { wallet, address, connected } = useWallet();
  const { notes: realNotes, loading, fetchNotes, deleteNote, updateNote, setNotes } = useNotes(wallet, address);
  
  const {
    searchQuery,
    sortBy,
    filterBy,
    filteredNotes,
    handleSearch,
    handleSort,
    handleFilter,
    clearFilters
  } = useSearch(realNotes);

  const displayNotes = filteredNotes;

  const [isRateLimited, setIsRateLimited] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, note: null });
  const [deleting, setDeleting] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [showNoteDetail, setShowNoteDetail] = useState(false);

  useEffect(() => {
    const loadNotes = async () => {
      try {
        await fetchNotes();
        setIsRateLimited(false);
      } catch (error) {
        console.error('Error fetching notes:', error);
        if (error.response?.status === 429) {
          setIsRateLimited(true);
        } else {
          toast.error('Failed to load notes');
        }
      }
    };

    loadNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDeleteClick = (noteId) => {
    const noteToDelete = realNotes.find(n => n._id === noteId);
    setDeleteModal({ isOpen: true, note: noteToDelete });
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
    setSelectedNote(note);
    setShowNoteDetail(true);
  };

  const handleCloseDetail = () => {
    setShowNoteDetail(false);
    setTimeout(() => setSelectedNote(null), 300); // Wait for animation
  };

  const handleDeleteFromDetail = async (noteId) => {
    await deleteNote(noteId);
    handleCloseDetail();
  };

  const handleUpdateNote = async (noteId, title, content) => {
    try {
      // Update the note (updateNote from useNotes handles both blockchain and state)
      await updateNote(noteId, title, content);
      
      // Update the selected note if it's the one being edited
      if (selectedNote?._id === noteId) {
        const updatedNote = realNotes.find(n => n._id === noteId);
        if (updatedNote) {
          setSelectedNote({ ...updatedNote, title, content });
        }
      }
      
      // Refresh to ensure we have latest data
      await fetchNotes();
    } catch (error) {
      console.error('Error updating note:', error);
      throw error;
    }
  };

  const stats = {
    total: realNotes.length,
    thisWeek: realNotes.filter(n => {
      const noteDate = new Date(n.createdAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return noteDate >= weekAgo;
    }).length
  };

  return (
    <div className="min-h-screen bg-[#1B2741]">
      {isRateLimited && <RateLimitedUI />}

      <div className="px-4 py-8 mx-auto max-w-7xl md:px-8">
        {/* Beautiful Header */}
        {!isRateLimited && (
          <BentoHeader 
            title="Jakwelin Notes" 
            subtitle="Organize your thoughts, powered by blockchain"
            stats={stats}
          />
        )}

        {/* Modern Filter Bar */}
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

        {/* Bento Grid Notes */}
        {!isRateLimited && !loading && (
          <NoteBentoGrid
            notes={filteredNotes}
            onDelete={handleDeleteClick}
            onNoteClick={handleNoteClick}
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
      </div>

      {/* Floating Action Buttons */}
      <FloatingActions onNoteCreated={fetchNotes} />

      {/* Delete Confirmation Modal */}
      <DeleteNote
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, note: null })}
        onConfirm={handleConfirmDelete}
        note={deleteModal.note}
        loading={deleting}
      />

      {/* Note Detail Slide-Over */}
      <NoteDetailSlideOver
        note={selectedNote}
        isOpen={showNoteDetail}
        onClose={handleCloseDetail}
        onDelete={handleDeleteFromDetail}
        onArchive={(noteId) => {
          toast.success('Note archived!');
          handleCloseDetail();
        }}
        onUpdate={handleUpdateNote}
      />
    </div>
  );
};

export default Home;

