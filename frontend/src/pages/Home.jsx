import React, { useEffect, useState } from 'react';
import NoteBentoGrid from '../components/notes/NoteBentoGrid';
import BentoHeader from '../components/common/BentoHeader';
import BentoFilterBar from '../components/filters/BentoFilterBar';
import FloatingActions from '../components/common/FloatingActions';
import DeleteNote from '../components/notes/DeleteNote';
import RateLimitedUI from '../components/RateLimitedUI';
import { useWallet } from '../hooks/useWallet';
import { useNotes } from '../hooks/useNotes';
import { useSearch } from '../hooks/useSearch';
import toast from 'react-hot-toast';

const Home = () => {
  const { wallet, address, connected } = useWallet();
  const { notes: realNotes, loading, fetchNotes, deleteNote, setNotes } = useNotes(wallet, address);
  
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
    const noteToDelete = displayNotes.find(n => n._id === noteId);
    
    // If using mock data, show warning
    if (realNotes.length === 0) {
      toast.error('This is a demo note! Connect your wallet to create and manage real notes.', {
        duration: 4000,
        icon: '🎭'
      });
      return;
    }
    
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

  const stats = {
    total: displayNotes.length,
    thisWeek: displayNotes.filter(n => {
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
        {/* Demo Mode Alert */}
        {realNotes.length === 0 && !loading && (
          <div className="mb-8 overflow-hidden text-white border-0 shadow-xl rounded-2xl alert bg-gradient-to-r from-brand-dark via-brand-medium to-brand-light">
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="flex-shrink-0 w-6 h-6 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div>
                <h3 className="text-lg font-bold">✨ Demo Mode - Explore the Design</h3>
                <p className="text-sm text-white/90">You're viewing sample notes with the new Bento layout! Connect your wallet to create your own blockchain-verified notes.</p>
              </div>
            </div>
          </div>
        )}

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
      <FloatingActions />

      {/* Delete Confirmation Modal */}
      <DeleteNote
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, note: null })}
        onConfirm={handleConfirmDelete}
        note={deleteModal.note}
        loading={deleting}
      />
    </div>
  );
};

export default Home;

