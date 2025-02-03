import React, { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../../../components/ui/popover'
import { Item } from './item'
import { FolderCheckIcon, FolderClosedIcon } from 'lucide-react'
import { Button } from '../../../components/ui/button'
import { useMediaQuery } from 'usehooks-ts'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { toast } from 'sonner'
import { IconPicker } from '@/components/icon-picker'

const Folder = () => {
    const isMobile = useMediaQuery(" (max-width: 786px) ");

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [icon, setIcon] = useState("");

    // Create Folder (from navbar)
    const createFolder = useMutation(api.documents.addFolder);

    // Create Folder
    const handleCreateFolder = () => {
        const foldername = title === ""
            ? alert("Folder name required")
            : title
        const promise = createFolder({ 
            title: foldername as string,
            description: description,
            icon: icon,
        });

        toast.promise(promise, {
            loading: 'Creating a new Folder...',
            success: 'New Folder created! 🥳',
            error: 'Failed to create a new note 🥲'
        });

        setTitle("");
        setDescription("");
        setIcon("");
    };

    return (
        <Popover>
            <PopoverTrigger className='w-full'>
                <Item
                    label='Add Folder'
                    icon={FolderCheckIcon}
                />
            </PopoverTrigger>
            <PopoverContent
                side={isMobile ? "bottom" : "right"}
                className='w-80 flex flex-col dark:bg-black bg-gray-500 p-2 rounded-xl items-center'
            >
                <div className='flex mt-2'>
                    <IconPicker
                      onChange={(e) => setIcon(e)}
                      asChild
                    >
                        <Button>
                            {icon ? (
                                <div>
                                    {icon}
                                </div>
                            ) :
                            <FolderClosedIcon />
                            }
                        </Button>
                    </IconPicker>
                    <input
                        className='p-1 rounded-md w-full ml-3'
                        type="text"
                        placeholder='Enter Folder Name'
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <label
                    htmlFor="description"
                    className='mt-3 rounded-md w-full'
                >
                    Enter Description(optional)
                </label>
                <textarea
                    className='p-1 rounded-md w-full'
                    placeholder='Description'
                    id='description'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <Button
                    className='w-14 mt-2'
                    size="sm"
                    onClick={handleCreateFolder}
                >
                    Add
                </Button>
            </PopoverContent>
        </Popover>
    )
}

export default Folder