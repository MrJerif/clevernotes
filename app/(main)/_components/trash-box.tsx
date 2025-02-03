"use client";

import { ConfrimModal } from "@/components/modals/confirm-modal";
import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { ArchiveRestore, Search, Trash, Undo } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

interface folderProps {
    folderId?: Id<"folders">
}

export const TrashBox = ({ folderId }: folderProps) => {
    const router = useRouter();
    const params = useParams();
    // api queries (trash)
    const documents = useQuery(api.documents.getTrash);
    const restore = useMutation(api.documents.restore);
    const remove = useMutation(api.documents.remove);
    const folderTrash = useQuery(api.documents.folderTrash);
    const removeFolder = useMutation(api.documents.removeFolders);
    const restoreFolder = useMutation(api.documents.restoreFolder);

    const [search, setSearch] = useState("");
    const [show, setShow] = useState(false);

    const getFolder = useQuery(api.documents.getFolders, {
        folderId: folderId
    });

    // Search function
    const filteredDocuments = documents?.filter((document) => {
        return document.title.toLowerCase().includes(search.toLowerCase());
    });

    const onClick = (documentId: string) => {
        if (!documentId) return;

        router.push(`/documents/${documentId}`);
    };

    // function to restore notes 
    const onRestore = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
        documentId: Id<"documents">,
    ) => {
        event.stopPropagation();
        const promise = restore({ id: documentId });

        toast.promise(promise, {
            loading: "Restoring note...",
            success: "Note restored successfully!",
            error: "Faild to restore note (",
        });
    };

    // Function to restore folders
    const onFolderRestore = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
        folderId: Id<"folders">
    ) => {
        event.stopPropagation();
        const promise = restoreFolder({ id: folderId });

        toast.promise(promise, {
            loading: "Restoring Folder...",
            success: "Folder restored successfully!",
            error: "Faild to restore Folder (",
        });
    };

    // function to remove/delete notes permanently
    const onRemove = (
        documentId: Id<"documents">,
    ) => {
        const promise = remove({ id: documentId });

        toast.promise(promise, {
            loading: "Deleting note...",
            success: "Note deleted successfully!",
            error: "Faild to delete note (",
        });

        // Redirect to /documents
        if (params.documentId === documentId) {
            router.push('/documents');
        }
    };

    // function to remove/delete Folders permanently
    const onFolderRemove = (
        folderId: Id<"folders">,
    ) => {
        const promise = removeFolder({ id: folderId });

        toast.promise(promise, {
            loading: "Deleting Folder...",
            success: "Folder deleted successfully!",
            error: "Faild to delete Folder (",
        });
    };

    // Loading state
    if (documents === undefined) {
        return (
            <div className="h-full flex items-center justify-center p-4">
                <Spinner size="lg" />
            </div>
        )
    }

    return (
        <div className="text-sm">
            <div className="flex items-center gap-x-1 p-2">
                <Search className="h-4 w-4" />
                <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="h-7 px-2 focus-visible:ring-transparent bg-secondary"
                    placeholder="Filter by note title..."
                />
            </div>

            {show ? (
                <Button
                    // variant="secondary"
                    // size="sm"
                    className="right-1 mx-1"
                    onClick={() => setShow(!show)}
                >
                    Folders
                </Button>
            ) : (
                <Button
                    variant="secondary"
                    size="sm"
                    className="right-1 mx-1"
                    onClick={() => setShow(!show)}
                >
                    Documents
                </Button>
            )}

            {/* <Button
                className="right-1"
            >
                Clear all
            </Button> */}

            {/* Notes */}
            {!show && (
                <div className="mt-2 px-1 pb-1">
                    <p className="hidden last:block text-xs text-center text-muted-foreground pb-2">
                        No notes found.
                    </p>
                    {filteredDocuments?.map((document) => (
                        <>
                            <div
                                key={document._id}
                                role="button"
                                onClick={() => onClick(document._id)}
                                className="text-base rounded-sm w-full hover:bg-primary/5 flex items-center
                        text-primary justify-between dark:bg-zinc-800 bg-gray-200"
                            >
                                <div>
                                    <span className="truncate pl-2">
                                        {document.title}
                                    </span>

                                    {document.folderId && (
                                        <div className="text-[10px] ml-2">
                                            Folder: <span>
                                                {(() => {
                                                    const noteFolder = getFolder?.find((folder) => folder._id === document.folderId);
                                                    return noteFolder ? noteFolder.title : "folder deleted";
                                                })()}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center">
                                    <div
                                        onClick={(e) => onRestore(e, document._id)}
                                        role="button"
                                        className="rounded-sm p-2 hover:bg-zinc-200"
                                    >
                                        <Undo className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <ConfrimModal onConfirm={() => onRemove(document._id)}>
                                        <div
                                            role="button"
                                            className="rounded-sm p-4 hover:bg-zinc-200"
                                        >
                                            <Trash className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                    </ConfrimModal>
                                </div>
                            </div>
                        </>
                    ))}
                </div>
            )}

            {/* Folders */}
            {show && (
                <div className="mt-2 px-1 pb-1">
                    <p className="hidden last:block text-xs text-center text-muted-foreground pb-2">
                        No Folders found.
                    </p>
                    {folderTrash?.map((folder) => (
                        <div
                            key={folder._id}
                            role="button"
                            className="tex-sm rounded-sm w-full hover:bg-primary/5 flex items-center
                        text-primary justify-between dark:bg-zinc-800 bg-gray-200"
                        >
                            <span className="truncate pl-2">
                                {folder.title}
                            </span>
                            <div className="flex items-center">
                                <div
                                    onClick={(e) => onFolderRestore(e, folder._id)}
                                    role="button"
                                    className="rounded-sm p-2 hover:bg-zinc-200"
                                >
                                    <Undo className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <ConfrimModal onConfirm={() => onFolderRemove(folder._id)}>
                                    <div
                                        role="button"
                                        className="rounded-sm p-4 hover:bg-zinc-200"
                                    >
                                        <Trash className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                </ConfrimModal>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>

    );
};