"use client";

import { Spinner } from '@/components/spinner';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useQuery } from 'convex/react';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { Item } from './item';
import { FileIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FolderlessProps {
    folderId?: Id<"folders">
    documentId?: Id<"documents">
    level?: number
}

const Folderless = ({ folderId, documentId, level = 0 }: FolderlessProps) => {
    const router = useRouter();
    const params = useParams();
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});

    // Get folders that are in Trash
    const folderTrash = useQuery(api.documents.folderTrash);
    const getFolders = useQuery(api.documents.getFolders, {
        folderId: folderId
    });

    // get request (Notes)
    const documents = useQuery(api.documents.getSidebar, {
        parentDocument: documentId,
        folderId: folderId
    });

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

    // Redirect to Note
    const onRedirect = (documentId: string) => {
        if (documents === null) {
            return (
                <Spinner />
            )
        }
        router.push(`/documents/${documentId}`);
    };

    // Expand Notes
    const onExpand = (documentId: string) => {
        setExpanded(prevExpanded => ({
            ...prevExpanded,
            [documentId]: !prevExpanded[documentId]
        }));
    };

    // const folder = folderTrash?.find((folder) => folder._id === document.folderId);
    return (
        <div>
            <p
                style={{
                    paddingLeft: level ? `${(level * 12) + 25}px` : undefined
                }}
                className={cn(
                    "hidden text-sm font-medium text-muted-foreground",
                    expanded && "last:block",
                    level === 0 && "hidden"
                )}
            >
                No pages inside
            </p>
            {documents?.map((document) => {
                // Find the folder associated with the document
                const folder = folderTrash?.find((f) => f._id === document.folderId);
                const checkFolders = getFolders?.find((folder) => folder?._id === document.folderId);

                // Only show the document if the folder exists and is archived
                if (folder?.isArchived || !checkFolders) {
                    return (
                        <div key={document._id}>
                            <Item
                                id={document._id}
                                onClick={() => onRedirect(document._id)}
                                label={document.title}
                                icon={FileIcon}
                                documentIcon={document.icon}
                                active={params.documentId === document._id}
                                level={level}
                                onExpand={() => onExpand(document._id)}
                                expanded={expanded[document._id]}
                                folderId={document.folderId}
                            />
                            {/* Render child notes (Recursion) */}
                            {expanded[document._id] && (
                                <Folderless
                                    documentId={document._id}
                                    folderId={document.folderId}
                                    level={level + 1}
                                />
                            )}
                        </div>
                    );
                }
                return null; // Skip rendering if the condition is not met
            })}
        </div>
    )
}

export default Folderless