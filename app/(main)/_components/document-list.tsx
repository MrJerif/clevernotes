"use client";

import { api } from '@/convex/_generated/api';
import { Doc, Id } from '@/convex/_generated/dataModel';
import { useQuery } from 'convex/react';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Item } from './item';
import { cn } from '@/lib/utils';
import { FileIcon } from 'lucide-react';
import { Spinner } from '@/components/spinner';

interface DocumentListProps {
    parentDocumentId?: Id<"documents">;
    level?: number;
    data?: Doc<"documents">[];
    folderId?: Id<"folders">;
}

export const DocumentList = ({ parentDocumentId, level = 0, folderId }: DocumentListProps) => {
    const params = useParams();
    const router = useRouter();
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});

    // get query (notes)
    const documents = useQuery(api.documents.getSidebar, {
        parentDocument: parentDocumentId
    });

    // Expand Notes
    const onExpand = (documentId: string) => {
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

    return (
        <>
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
            {documents.map((document) => (
                <div>
                    {document.folderId && (
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
                            />
                            {/* Render child notes (Recursion) */}
                            {expanded[document._id] && (
                                <DocumentList
                                    parentDocumentId={document._id}
                                    folderId={document.folderId}
                                    level={level + 1}
                                />
                            )}
                        </div>
                    )}
                </div>
            ))}
        </>
    )
}

// export default DocumentList