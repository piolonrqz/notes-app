import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import './App.css'

import HomePage from './pages/Homepage'
import CreatePage from './pages/CreatePage'
import EditPage from './pages/EditPage'
import NoteDetailPage from './pages/NoteDetailPage'

function App() {
  return (
    <div className="min-h-screen">
      <Router>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create" element={<CreatePage />} />
          <Route path="/notes/:id" element={<NoteDetailPage />} />
          <Route path="/notes/:id/edit" element={<EditPage />} />
          <Route
            path="*"
            element={<div className="p-8 text-center">404 — Page not found</div>}
          />
        </Routes>
      </Router>
    </div>
  )
}

export default App
