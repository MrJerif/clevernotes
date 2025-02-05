'use client';

import { useRouter } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { cn } from "@/lib/utils"
import {
  DropdownMenu, DropdownMenuTrigger,
  DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import { useMutation, useQuery } from "convex/react"
import { ChevronDown, ChevronRight, LucideIcon, MoreHorizontal, Plus, ScissorsIcon, Trash } from "lucide-react"
import { toast } from "sonner"
import { useUser } from "@clerk/clerk-react"
import { FolderItem } from "./folder-item";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"


interface ItemProps {
  id?: Id<"documents">
  documentIcon?: string
  active?: boolean
  expanded?: boolean
  isSearch?: boolean
  level?: number
  onExpand?: () => void
  label: string
  onClick?: () => void
  icon: LucideIcon
  folderId?: Id<"folders">
}

export function Item({ id, label, onClick, icon: Icon, active, documentIcon, isSearch, level = 0, onExpand, expanded, folderId }: ItemProps) {

  const { user } = useUser();
  const router = useRouter();
  const create = useMutation(api.documents.create);
  const archive = useMutation(api.documents.archive);
  const move = useMutation(api.documents.moveNotes);

  const onArchive = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation()
    if (!id) return
    const promise = archive({ id })
      .then(() => router.push('/documents'))

    toast.promise(promise, {
      loading: "Moving to trash...",
      success: "Note moved to trash!",
      error: "Failed to archive note ("
    })
  };

  const handleExpand = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation()
    onExpand?.()
  };

  // get request (Folders)
  const folders = useQuery(api.documents.getFolders, {
    folderId: folderId
  });

  // Move notes to different folder
  const moveNotes = (fId: Id<"folders">) => {
    if (!id) return;

    const promise = move({ 
      id,
      folderId: fId
    })
      .then(() => router.push(`/documents/${id}`))

    toast.promise(promise, {
      loading: "Moving Note...",
      success: "Note moved to Folder!",
      error: "Failed to move note ("
    })
  };

  // Create a note
  const onCreate = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation()
    if (!id) return;

    const promise = create({
      title: "Untitled",
      parentDocument: id,
      folderId: folderId
    })
      .then((documentId) => {
        if (!expanded) {
          onExpand?.()
        }
        router.push(`/documents/${documentId}`)
      })

    toast.promise(promise, {
      loading: 'Creating a new note...',
      success: 'New note created!',
      error: 'Failed to create a new note'
    })
  }

  const ChevronIcon = expanded ? ChevronDown : ChevronRight

  return (
    <>
      <div className={cn(`group min-h-[27px] text-sm py-1 pr-3 w-full hover:bg-primary/5
    flex items-center text-muted-foreground font-medium`,
        active && 'bg-primary/5 text-primary')}
        onClick={onClick} role="button" style={{ paddingLeft: level ? `${(level * 12) + 12}px` : '12px' }}>
        {!!id && (
          <div className="h-full rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 mr-1" onClick={handleExpand} role="button">
            <ChevronIcon className="w-4 h-4 shrink-0 text-muted-foreground/50" />
          </div>
        )}
        {documentIcon ? (
          <div className="shrink-0 mr-2 text-[18px]">
            {documentIcon}
          </div>
        ) :
          <Icon className="shrink-0 w-[18px] h-[18px] mr-2 text-muted-foreground" />
        }
        <span className="truncate">
          {label}
        </span>
        {isSearch && (
          <kbd className="ml-auto pointer-events-none inline-flex gap-1 items-center h-5 select-none rounded border
        bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span className="text-xs">⌘</span>K
          </kbd>
        )}

        {!!id && (
          <div className="ml-auto flex items-center gap-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <div className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm
              hover:bg-neutral-300 dark:hover:bg-neutral-600" role="button">
                  <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-60" align="start" side="right" forceMount>

                <Dialog>
                  <DialogTrigger className="flex items-center justify-center ml-2 gap-2">
                    <ScissorsIcon className="w-4 h-4 mr-2" />
                    Move
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Select Folder</DialogTitle>
                      <DialogDescription>
                        <div className=''>
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
                                  onClick={() => moveNotes(folder._id)}
                                />
                              </div>
                            ))
                          ) : (
                            <div>
                              No folders!
                            </div>
                          )}
                        </div>
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>

                <DropdownMenuItem onClick={onArchive}>
                  <Trash className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <div className="text-xs text-muted-foreground p-2">
                  created by: {user?.fullName ? user?.fullName : user?.emailAddresses[0].emailAddress}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
              role="button" onClick={onCreate}>
              <Plus className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
        )}
      </div>

      {/* {folderActive && (
        <Dialog>
           <DialogTrigger>Open</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete your account
                and remove your data from our servers.
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )} */}
    </>

  )
}

Item.Skeleton = function ItemSkeleton({ level }: { level?: number }) {
  return (
    <div className="flex gap-x-2 py-[3px]" style={{ paddingLeft: level ? `${(level * 12) + 25}px` : '12px' }}>
      <Skeleton className="w-4 h-4" />
      <Skeleton className="w-4 h-[30%]" />
    </div>
  )
}
