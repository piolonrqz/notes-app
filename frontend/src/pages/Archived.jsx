import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, ArchiveRestoreIcon } from 'lucide-react';
import NavigationBar from '../components/NavigationBar';
import NoteGrid from '../components/notes/NoteGrid';
import Loading from '../components/common/Loading';
import Button from '../components/common/Button';
import { useWallet } from '../hooks/useWallet';
import notesService from '../services/notesService';
import toast from 'react-hot-toast';

const Archived = () => {
  const { address, connected } = useWallet();
  const [archivedNotes, setArchivedNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unarchiving, setUnarchiving] = useState(null);

  useEffect(() => {
    const fetchArchivedNotes = async () => {
      if (!connected || !address) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await notesService.getArchivedNotes(address);
        setArchivedNotes(data);
      } catch (error) {
        console.error('Error fetching archived notes:', error);
        toast.error('Failed to load archived notes');
      } finally {
        setLoading(false);
      }
    };

    fetchArchivedNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, connected]);

  const handleUnarchive = async (noteId) => {
    try {
      setUnarchiving(noteId);
      await notesService.unarchiveNote(noteId, address);
      setArchivedNotes(prev => prev.filter(note => note._id !== noteId));
      toast.success('Note unarchived successfully');
    } catch (error) {
      console.error('Error unarchiving note:', error);
      toast.error('Failed to unarchive note');
    } finally {
      setUnarchiving(null);
    }
  };

  return (
    <div className="min-h-screen bg-base-100">
      <NavigationBar />

      <div className="container px-4 py-8 mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Archived Notes</h1>
            <p className="mt-2 text-base-content/70">
              View and restore your archived notes
            </p>
          </div>

          <Link to="/" className="btn btn-ghost">
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
        </div>

        {/* Wallet Connection Check */}
        {!connected && (
          <div className="max-w-md mx-auto my-12">
            <div className="shadow-lg alert alert-warning">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="flex-shrink-0 w-6 h-6 stroke-current"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <span>Please connect your wallet to view archived notes</span>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && connected && (
          <Loading text="Loading archived notes..." />
        )}

        {/* Empty State */}
        {!loading && connected && archivedNotes.length === 0 && (
          <div className="py-12 text-center">
            <div className="inline-block p-8 rounded-lg bg-base-200">
              <ArchiveRestoreIcon className="w-16 h-16 mx-auto mb-4 text-base-content/30" />
              <p className="text-lg text-base-content/70">No archived notes</p>
              <p className="mt-2 text-sm text-base-content/50">
                Notes you archive will appear here
              </p>
            </div>
          </div>
        )}

        {/* Archived Notes Grid */}
        {!loading && connected && archivedNotes.length > 0 && (
          <div>
            <div className="mb-4">
              <p className="text-sm text-base-content/60">
                {archivedNotes.length} archived {archivedNotes.length === 1 ? 'note' : 'notes'}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {archivedNotes.map((note) => (
                <div key={note._id} className="relative">
                  <div className="p-6 transition-all border rounded-lg shadow-sm bg-base-100 border-base-300 hover:shadow-md">
                    <h3 className="mb-2 text-lg font-semibold">{note.title}</h3>
                    <p className="mb-4 text-sm text-base-content/70 line-clamp-3">
                      {note.content}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-base-content/50">
                        Archived
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleUnarchive(note._id)}
                        loading={unarchiving === note._id}
                        disabled={unarchiving !== null}
                      >
                        <ArchiveRestoreIcon className="w-4 h-4 mr-1" />
                        Restore
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Archived;

