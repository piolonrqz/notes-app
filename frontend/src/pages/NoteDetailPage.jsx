import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../lib/axios'
import toast from 'react-hot-toast'
import { formatDate } from '../lib/utils'
import { ArrowBigLeft } from 'lucide-react'

const NoteDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [note, setNote] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const { data } = await api.get(`/notes/${id}`)
        setNote(data)
        setError('')
      } catch (err) {
        setError(err.response?.data?.message || 'Note not found')
        toast.error('Failed to fetch note')
      } finally {
        setLoading(false)
      }
    }
    fetchNote()
  }, [id])

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this note?')) return

    try {
      await api.delete(`/notes/${id}`)
      toast.success('Note deleted successfully')
      navigate('/')
    } catch (err) {
      toast.error('Failed to delete note')
      console.error('Delete error:', err)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center mt-8">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  if (error || !note) {
    return (
      <div className="container p-4 mx-auto">
        <div className="shadow-lg alert alert-error">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 w-6 h-6 stroke-current" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error || 'Note not found'}</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-3xl p-4 mx-auto">
      <div className="p-6 rounded-lg shadow-lg bg-base-100">
        <div className="flex items-start justify-between mb-6">
          <button
            onClick={() => navigate('/')}
            className="btn btn-ghost"
          >
            <ArrowBigLeft/>
            Back to Homepage
          </button>
          <button
            onClick={handleDelete}
            className="btn btn-error"
          >
            Delete Note
          </button>
        </div>
        
        <h1 className="mb-4 text-4xl font-bold">{note.title}</h1>
        <p className="mb-6 text-sm text-base-content/60">
          Created {formatDate(new Date(note.createdAt))}
        </p>
        <div className="prose max-w-none">
          <p className="whitespace-pre-line">{note.content}</p>
        </div>
      </div>
    </div>
  )
}

export default NoteDetailPage
