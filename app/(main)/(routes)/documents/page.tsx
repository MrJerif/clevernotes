"use client";
import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/clerk-react';
import { useMutation } from 'convex/react';
import { PlusCircle } from 'lucide-react';
import { api } from "@/convex/_generated/api";
import React from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const DocumentsPage = () => {
    const { user } = useUser();
    const create = useMutation(api.documents.create);
    const router = useRouter();

    // Create Note handler
    const onCreate = () => {
        const promise = create({ title: "Untitled"})
            .then((documentId) => router.push(`/documents/${documentId}`))

        toast.promise(promise, {
            loading: 'Creating a new note...',
            success: 'New note created!',
            error: 'Failed to create a new note :('
        });
    };

    return (
        <div className='h-full flex flex-col items-center justify-center space-x-4'
        >
            {user?.firstName ?
                <h2 className='text-lg font-medium'>
                    Welcome to {user?.firstName}&apos;s Workspace
                </h2> :
                <h2 className='text-lg font-medium'>
                    Welcome to &quot;No_Name&quot; &apos;s Workspace
                </h2>
            }
            <Button onClick={onCreate}>
                <PlusCircle className='h-4 w-4 mr-2'/>
                Create a Note
            </Button>
        </div>
    )
}

export default DocumentsPage