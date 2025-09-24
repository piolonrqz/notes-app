import { PlusIcon } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'

const NavigationBar = () => {
  return (
    <header className='border-b bg-base-300 border-base-content/10'>
      <div className='max-w-6xl p-4 mx-auto'>
        <div className='flex items-center justify-between'>
        <h1 className='font-mono text-3xl font-bold text-primary tracking-light'>Jakwelin Notes App</h1>
        <div className='flex items-center gap-4'>
            <Link to={"/create"} className='btn btn-primary'>
              <PlusIcon className='w-5 h-5 mr-2'/> 
              <span>New Note</span>
            </Link>
        </div>

        </div>
      </div>
    </header>
  )
}

export default NavigationBar