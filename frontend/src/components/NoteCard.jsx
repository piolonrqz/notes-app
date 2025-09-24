import { PenSquareIcon, Trash2Icon } from 'lucide-react';
import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { formatDate } from '../lib/utils';
import toast from 'react-hot-toast';
import api from '../lib/axios';

const NoteCard = ({note, setNotes}) => {
  const navigate = useNavigate();

  const handleDelete = async (e, id) => {
    e.preventDefault();

    if(!window.confirm("Are you sure you want to delete this note ?"))
      return;

    try {
      await api.delete(`/notes/${id}`);
      setNotes((prev) => prev.filter((note) => note._id !== id));
      toast.success("Note deleted successfully");
    } catch (error) {
      console.log("Error in delete routing", error);
      toast.error("Failed to delete note");
    }
  }

  const handleEdit = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/notes/${id}/edit`);
  }

  return (
    <Link to={`/notes/${note._id}`} className='transition-all duration-200 border-t-4 border-solid border-primary card bg-base-100 hover:shadow-lg'>
      <div className='rounded bg-primary card-body'>
        <h3 className='card-title text-base-content'>{note.title}</h3>
        <p className='text-base-content/70 line-clamp-3'>{note.content}</p>
        <div className='items-center justify-between mt-4 card-actions'>
            <span className='text-sm text-base-content/60'>{formatDate(new Date(note.createdAt))}</span>
            <div className='flex items-center gap-1 '>
                <button 
                  className='btn btn-primary btn-xs p-1'
                  onClick={(e) => handleEdit(e, note._id)}
                >
                  <PenSquareIcon className='w-4 h-4'/>
                </button>
                <button 
                    className='btn btn-primary btn-xs p-1'
                    onClick={(e) => handleDelete(e, note._id)}
                >
                    <Trash2Icon className='w-4 h-4' />
                </button>
            </div>
        </div>
      </div>
    </Link>
  )
}

export default NoteCard