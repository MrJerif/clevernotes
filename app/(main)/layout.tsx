"use client"
import { Spinner } from '@/components/spinner';
import { useConvexAuth } from 'convex/react';
import { redirect } from 'next/navigation';
import React from 'react'
import Navigation from './_components/navigation';
import { SearchCommand } from '@/components/search-command';
import { Metadata } from 'next';

export const meta: Metadata = {
    metadataBase: new URL(`${process.env.NEXT_PUBLIC_BASE_URL}`),
    keywords: ['CleverNotes', 'Notes', 'Organize', 'Note App', 'Note taking', 'Ai', 'Gemini', 'Web App', 'Project',
        'Markdown', 'readme', 'pdf', 'document', 'note',],
    title: {
        default: 'CleverNotes',
        template: '%s - CleverNotes',
    },
    description: 'Create notes, files in markdown, share via unique links or download. CleverNotes is an AI-powered note-taking app that helps you write better notes.',
    // description: 'CleverNotes is a note-taking app that helps you organize your thoughts and ideas. It uses AI to help you write better notes.',
}

const MainLayout = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, isLoading } = useConvexAuth();

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Spinner size="lg" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return redirect("/");
    }

    return (
        <div className='h-full flex dark:bg-[#1F1F1F]'>
            <Navigation />
            <main className='flex-1 h-full overflow-y-auto'>
                <SearchCommand />
                {children}
            </main>
        </div>
    )
}

export default MainLayout