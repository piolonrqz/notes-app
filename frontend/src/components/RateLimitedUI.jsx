import { ZapIcon } from 'lucide-react'
import React from 'react'

const RateLimitedUI = () => {
  return (
    <div className='max-w-6xl px-4 py-8 mx-auto'>
        <div className='border rounded-lg shadow-md bg-primary/10 border-primary/30'>
            <div className='flex flex-col items-center p-6 md:flex-row'>
                <div className='flex-shrink-0 p-4 mb-4 bg-primary/20 round-full md:mb-0 md:mr-6'>
                    <ZapIcon className='size-10 text-primary' /> 
                </div>
                <div className='flex-1 text-center md:text-left'>
                    <h3 className='mb-2 text-xl font-bold'>Rate Limit Reached</h3>
                    <p className='mb-1 text-base-content'>You've made too many request in a short period. Please wait a moment.</p>
                    <p className='text-sm text-base-content/70'>Try again in a few seconds for the best experience</p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default RateLimitedUI