import React, { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../../../components/ui/popover'
import { Item } from './item'
import { FolderCheckIcon, FolderClosedIcon, PlusCircle, Target } from 'lucide-react'
import { Button } from '../../../components/ui/button'
import { useMediaQuery } from 'usehooks-ts'
import { useMutation, useQueries, useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { toast } from 'sonner'
import { IconPicker } from '@/components/icon-picker'
import { Id } from '@/convex/_generated/dataModel'
import { FolderItem } from './folder-item'
import { useRouter } from 'next/navigation'

interface AddNoteProps {
    folderId?: Id<"folders">
}

const AddNote = ({ folderId }: AddNoteProps) => {
    const isMobile = useMediaQuery(" (max-width: 786px) ");

    const router = useRouter();

    // const [title, setTitle] = useState("");
    // const [description, setDescription] = useState("");
    // const [icon, setIcon] = useState("");

    // Create Notes (from navbar)
    const create = useMutation(api.documents.create);

    // get request (Folders)
    const folders = useQuery(api.documents.getFolders, {
        folderId: folderId
    });

    // Create Note handler (with folderId)
    const handleCreate = (id: string) => {
        if (!id) return;

        const promise = create({
            title: "Untitled",
            folderId: id as Id<"folders">
        })
        .then((documentId) => router.push(`/documents/${documentId}`))

        toast.promise(promise, {
            loading: 'Creating a new note...',
            success: 'New note created!',
            error: 'Failed to create a new note :('
        });
    };

    // Create a seperate note
    const seperateNote = () => {
        const promise = create({ title: "untitled" })
            .then((documentId) => router.push(`/documents/${documentId}`));

        toast.promise(promise, {
            loading: 'Creating a new note...',
            success: 'New note created!',
            error: 'Failed to create a new note :('
        });
    }

    return (
        <Popover>
            <PopoverTrigger className='w-full'>
                <Item
                    label='Create a Note'
                    icon={PlusCircle}
                />
            </PopoverTrigger>
            <PopoverContent
                side={isMobile ? "bottom" : "right"}
                className='w-80 flex flex-col dark:bg-black bg-gray-500 p-2 rounded-xl items-center'
            >
                <h2 className='m-2 text-lg font-semibold'>Select Folder</h2>
                <div className='w-[94%]'>
                    {folders && folders.length > 0 ? (
                        folders.map((folder) => (
                            <div
                                key={folder._id}
                                className='m-1'
                            >
                                <FolderItem
                                    id={folder._id}
                                    label={folder.title}
                                    folderIcon={folder.icon}
                                    onClick={() => handleCreate(folder._id)}
                                />
                            </div>
                        ))
                    ) : (
                        <div>
                            No folders!
                        </div>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    )
}

export default AddNote