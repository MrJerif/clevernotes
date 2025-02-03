import React from 'react';
import { Navbar } from './_components/navbar';
import Footer from './_components/footer';
import { Metadata } from 'next';

export const meta: Metadata = {
  metadataBase: new URL(`${process.env.NEXT_PUBLIC_BASE_URL}`),
  keywords: ['CleverNotes', 'Notes', 'Organize', 'Note App', 'Note taking', 'Ai', 'Gemini', 'Web App', 'Project',
      'Markdown', 'readme', 'pdf', 'document', 'note',],
  title: 'CleverNotes',
  description: 'Create notes, files in markdown, share via unique links or download. CleverNotes is an AI-powered note-taking app that helps you write better notes.',
}

const LandingPageLayout = ({
  children
}: {
    children: React.ReactNode;
}) => {
  return (
    <div className='h-full'>
        <Navbar />
        <main className='h-full pt-40'>
            {children}
        </main>
        {/* <Footer /> */}
    </div>
  )
}

export default LandingPageLayout