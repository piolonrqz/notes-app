import { ArrowLeftIcon } from 'lucide-react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../lib/axios'
import NavigationBar from '../components/NavigationBar'

const CreatePage = () => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) {
      toast.error('All fields are required')
      return
    }

    setLoading(true)

    try {
      await api.post('/notes', { title, content })
      toast.success('Note created successfully')
      navigate('/')
    } catch (error) {
      console.log('Error in note creation', error)
      if (error.response?.status === 429) {
        toast.error("You're creating notes too fast", {
          duration: 4000,
          icon: '🤬',
        })
      } else {
        toast.error('Failed to create a note')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-base-200">
      <NavigationBar />
      <div className="container px-4 py-8 mx-auto">
        <div className="max-w-lg mx-auto">
          <Link to={'/'} className="inline-flex items-center gap-2 mb-6 btn btn-ghost">
            <ArrowLeftIcon className="w-5 h-5" />
            Back to Notes
          </Link>
          <div className="shadow-sm card card-compact bg-base-100">
            <div className="p-4">
              <h2 className="mb-3 text-xl font-semibold">Create New Note</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3 form-control">
                  <label className="label">
                    <span className="label-text">Title</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Note title"
                    className="w-full input input-bordered"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="mb-3 form-control">
                  <label className="label">
                    <span className="label-text">Content</span>
                  </label>

                  <textarea
                    placeholder="Write your note here"
                    className="w-full mb-3 h-28 textarea textarea-bordered"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                  <div className="justify-end card-actions ">
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? 'Creating...' : 'Create Note'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreatePage