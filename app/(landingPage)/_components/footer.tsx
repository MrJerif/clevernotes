import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    <div className='flex items-center justify-between w-full bg-background z-50
          border p-4 dark:bg-black bg-gray-300 dark:text-white text-black rounded-md
    '>
        <div>
            <p>© 2025 CleverNotes</p>
        </div>
        <Link 
          href='https://github.com/MrJerif/clevernotes/tree/main'
          className='text-blue-500'
        >
            Source Code
        </Link>
    </div>
  )
}

export default Footer