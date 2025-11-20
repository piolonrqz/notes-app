import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavigationBar from '../components/NavigationBar';
import NoteDetail from '../components/notes/NoteDetail';
import DeleteNote from '../components/notes/DeleteNote';
import { useWallet } from '../hooks/useWallet';
import { useNotes } from '../hooks/useNotes';
import toast from 'react-hot-toast';

const NoteDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { wallet, address } = useWallet();
  const { getNote, deleteNote, archiveNote } = useNotes(wallet, address);
  
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        setLoading(true);
        const data = await getNote(id);
        setNote(data);
      } catch (error) {
        console.error('Error fetching note:', error);
        toast.error('Note not found');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleDelete = () => {
    setDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setDeleting(true);
      await deleteNote(id);
      setDeleteModal(false);
      navigate('/');
    } catch (error) {
      console.error('Delete error:', error);
    } finally {
      setDeleting(false);
    }
  };

  const handleArchive = async (noteId) => {
    try {
      await archiveNote(noteId);
      navigate('/');
    } catch (error) {
      console.error('Archive error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-base-100">
      <NavigationBar />
      
      <NoteDetail
        note={note}
        onDelete={handleDelete}
        onArchive={handleArchive}
        loading={loading}
      />

      <DeleteNote
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        note={note}
        loading={deleting}
      />
    </div>
  );
};

export default NoteDetailPage;
