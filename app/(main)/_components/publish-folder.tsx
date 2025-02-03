"use client";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useOrigin } from "@/hooks/use-origin";
import { useMutation } from "convex/react";
import { CheckIcon, CopyIcon, GlobeIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface PublishFolderProps {
    id: Id<"folders">
    folder: Doc<"folders">
    initialData?: Doc<"documents">
};

export const PublishFolder = ({ initialData, id, folder }: PublishFolderProps) => {
    const origin = useOrigin();
    const update = useMutation(api.documents.update);
    const folderUpdate = useMutation(api.documents.updateFolder);
    // const folderUpdate = useMutation(api.documents.publishFolder)

    const [copied, setCopied] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Function to publish note
    const onPublish = () => {
        setIsSubmitting(true);

        // const promise = update({
        //     id: initialData._id,
        //     isPublished: true,
        // })
        //     .finally(() => setIsSubmitting(false));
        const promise = folderUpdate({
            id: id,
            isPublished: true,
        })
            .finally(() => setIsSubmitting(false));

        toast.promise(promise, {
            loading: "Publishing...",
            success: "Folder Published successfully! 🥳",
            error: "Failed to publish folder! 🥲",
        });
    };

    // Function to unpublish note
    const onUnpublish = () => {
        setIsSubmitting(true);

        // const promise = update({
        //     id: initialData._id,
        //     isPublished: false,
        // })
        //     .finally(() => setIsSubmitting(false));
        const promise = folderUpdate({
            id: id,
            isPublished: false,
        })
            .finally(() => setIsSubmitting(false));

        toast.promise(promise, {
            loading: "Unpublishing...",
            success: "Folder Unpublished successfully! 🥳",
            error: "Failed to unpublish folder! 🥲",
        });
    };

    // Function to Copy link of published note
    const onCopy = () => {
        navigator.clipboard.writeText(url);
        setCopied(true);

        setTimeout(() => {
            setCopied(false);
        }, 1500)
    };

    const url = `${origin}/folderpreview/${id}`
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button size="sm" variant="ghost">
                    Publish
                    {folder.isPublished && (
                        <GlobeIcon
                            className="text-sky-500 w-4 h-4 ml-2"
                        />
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="w-72"
                align="end"
                alignOffset={8}
                forceMount
            >
                {folder.isPublished ? (
                    <div className="space-y-4">
                        <div className="flex items-center gap-x-2">
                            <GlobeIcon className="text-sky-500 animate-pulse h-4 w-4" />
                            <p className="text-xs font-medium text-sky-500">
                                This Folder is live on web.
                            </p>
                        </div>
                        {/* URL */}
                        <div className="flex items-center">
                            <input
                                type="text"
                                value={url}
                                className="flex-1 px-2 text-sm border rounded-l-md h-8 bg-muted truncate"
                                disabled
                            />
                            <Button
                                onClick={onCopy}
                                disabled={copied}
                                className="h-8 rounded-l-none"
                            >
                                {copied ? (
                                    <CheckIcon className="h-4 w-4" />
                                ) : (
                                    <CopyIcon className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                        {/* Unpublish button */}
                        <Button
                            size="sm"
                            className="w-full text-xs"
                            disabled={isSubmitting}
                            onClick={onUnpublish}
                        >
                            Unpublish
                        </Button>

                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center">
                        <GlobeIcon
                            className="h-8 w-8 text-muted-foreground mb-2"
                        />
                        <p className="text-sm font-medium mb-2">
                            Publish this Folder
                        </p>
                        <span className="text-sm text-muted-foreground mb-4">
                            Share your work with others.
                        </span>

                        <Button
                            disabled={isSubmitting}
                            onClick={onPublish}
                            className="w-full text-sm"
                            size="sm"
                        >
                            Publish
                        </Button>
                    </div>
                )}
            </PopoverContent>
        </Popover>
    )
}