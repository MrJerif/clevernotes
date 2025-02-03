'use client';

import { Spinner } from "@/components/spinner";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "convex/react";
import { ChevronDown, FileIcon, FolderCheckIcon, LucideIcon, MoreHorizontal, Plus, Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Item } from "./item";
import { DocumentList } from "./document-list";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { PublishFolder } from "./publish-folder";
import { Menu } from "./menu";
import { Title } from "./title";

interface FolderItemProps {
    id: Id<"folders">
    documentId?: Id<"documents">
    folderIcon?: string
    active?: boolean
    folderExpanded?: boolean
    isSearch?: boolean
    level?: number
    onExpand?: () => void
    label: string
    onClick?: () => void
    icon?: LucideIcon
    // description?: string
}


export function FolderItem({ id, folderIcon, active, folderExpanded, level = 0, onExpand, label, onClick, documentId }: FolderItemProps) {
    // Notes
    const params = useParams();
    const router = useRouter();
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});
    const create = useMutation(api.documents.create);
    const archive = useMutation(api.documents.archiveFolder);
    const archiveNotes = useMutation(api.documents.archive);

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        // Prevent the event from bubbling if necessary
        event.stopPropagation();

        // Trigger onExpand if defined
        onExpand?.();

        // Trigger onClick if defined
        onClick?.();
    };

    // get query (notes)
    const documents = useQuery(api.documents.getSidebar, {
        parentDocument: documentId,
    });

    // get request (Folders by Id)
    const folders = useQuery(api.documents.folderById, {
        folderId: id as Id<"folders">,
    });

    // Loading
    if (folders === undefined) {
        return (
            <nav className="bg-background dark:bg-[#1F1F1F] px-3 py-2 w-full
            flex items-center justify-between">
                <Title.Skeleton />
                <div className="flex items-center gap-x-2">
                    <Menu.Skeleton />
                </div>
            </nav>
        );
    }

    if (folders === null) {
        return;
    }

    // Expand Notes
    const onNoteExpand = (documentId: string) => {
        setExpanded(prevExpanded => ({
            ...prevExpanded,
            [documentId]: !prevExpanded[documentId]
        }));
    };

    // Redirect to Note
    const onRedirect = (documentId: string) => {
        if (documents === null) {
            return (
                <Spinner />
            )
        }
        router.push(`/documents/${documentId}`);
    };

    // Loading state
    if (documents === undefined) {
        return (
            <>
                <Item.Skeleton level={level} />
                {level === 0 && (
                    <>
                        <Item.Skeleton level={level} />
                        <Item.Skeleton level={level} />
                    </>
                )}
            </>
        );
    };

    const onCreate = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.stopPropagation()
        if (!id) return;
        const promise = create({
            title: "Untitled",
            folderId: id
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
    };

    // const publishFolder = () => {

    // };

    const onFolderArchive = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.stopPropagation();
        if (!id) return;

        documents.map((document) => {
            // let did = document._id
            if (document.folderId === id) {
                // Archive document using documentId
                const id = document._id
                archiveNotes({ id });
            }
        })
        // Archive folder using folderId
        const promise = archive({ id })
            .then(() => router.push('/documents'))

        toast.promise(promise, {
            loading: "Moving to trash...",
            success: "Folder moved to trash!",
            error: "Failed to archive Folder ("
        });
    }

    return (
        <>
            <div
                className={cn(`group min-h-[32px] text-md py-1 pr-3 w-full hover:bg-primary/5
                flex items-center text-muted-foreground font-medium border dark:border-gray-500 rounded-sm gap-x-2`,
                    active && 'bg-primary/5 text-primary')}
                onClick={handleClick} role="button" style={{ paddingLeft: level ? `${(level * 12) + 12}px` : '12px' }}
            >
                {folderExpanded && (
                    <div className="h-full rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 mr-1" role="button">
                        <ChevronDown
                            className="w-3 h-3 shrink-0 text-muted-foreground/50"
                        />
                    </div>
                )}

                {folderIcon ? (
                    <div className="shrink-0 mr-2 text-[18px]">
                        {folderIcon}
                    </div>
                ) :
                    <FolderCheckIcon className="shrink-0 w-[18px] h-[18px] mr-2 text-muted-foreground" />
                }
                <span className="truncate">
                    {label}
                </span>

                <div className="ml-auto flex items-center gap-x-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <div className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm
                                hover:bg-neutral-300 dark:hover:bg-neutral-600" role="button">
                                <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-60" align="start" side="right" forceMount>
                            {/* <DropdownMenuItem onClick={() => {}}> */}
                            {/* <GlobeIcon className="w-4 h-4 mr-2" />
                                Publish */}

                            <PublishFolder id={id} folder={folders} />
                            {/* </DropdownMenuItem> */}
                            <DropdownMenuItem onClick={onFolderArchive}>
                                <Trash className="w-4 h-4 mr-2" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <div className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
                        role="button" onClick={onCreate}>
                        <Plus className="w-4 h-4 text-muted-foreground" />
                    </div>
                </div>
            </div>

            {/* // Render notes  */}
            {folderExpanded && documents.map((document) => (
                <>
                    <div>
                        {document.folderId === id && (
                            <div key={document._id}>
                                <Item
                                    id={document._id}
                                    onClick={() => onRedirect(document._id)}
                                    label={document.title}
                                    icon={FileIcon}
                                    documentIcon={document.icon}
                                    active={params.documentId === document._id}
                                    level={level}
                                    onExpand={() => onNoteExpand(document._id)}
                                    expanded={expanded[document._id]}
                                    folderId={document.folderId}
                                />
                                {/* {/* Render child notes (Recursion) */}
                                {expanded[document._id] && (
                                    <DocumentList
                                        parentDocumentId={document._id}
                                        folderId={document.folderId}
                                        // folderId={id}
                                        level={level + 1}
                                    />
                                )}
                            </div>
                        )}
                    </div>
                </>
            ))}

            {/* Folder empty */}
            {/* <p
                style={{
                    paddingLeft: level ? `${(level * 12) + 25}px` : undefined
                }}
                className={cn(
                    "hidden text-sm font-medium text-muted-foreground",
                    folderExpanded && "last:block",
                    level === 0 && "hidden"
                )}
            >
                Folder is empty
            </p> */}
        </>
    )
}