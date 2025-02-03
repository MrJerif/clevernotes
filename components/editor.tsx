"use client";

import React from "react";
import { useTheme } from "next-themes";
import { useEdgeStore } from "@/lib/edgestore";

import { BlockNoteEditor, PartialBlock } from '@blocknote/core';
import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import "@blocknote/core/fonts/inter.css";

interface EditorProps {
    onChange: (value: string) => void;
    initialContent?: string;
    editable?: boolean;
};

const Editor = ({
    onChange,
    initialContent,
    editable,
}: EditorProps) => {
    const { resolvedTheme } = useTheme();
    const { edgestore } = useEdgeStore();

    // Upload Images to database
    const uploadFile = async (file: File) => {
        const response = await edgestore.publicFiles.upload({
            file
        });
        return response.url;
    };

    // Initialize the editor with BlockNote
    const editor: BlockNoteEditor = useCreateBlockNote({
        initialContent:
            initialContent
                ? (JSON.parse(initialContent) as PartialBlock[])
                : undefined,
        uploadFile,
    });

    const handleContentChange = () => {
        const content = editor.document;
        onChange(JSON.stringify(content, null, 2));
    };

    return (
        <BlockNoteView
            editable={editable}
            onChange={handleContentChange}
            editor={editor}
            theme={resolvedTheme === "dark" ? "dark" : "light"}
        />
    );
};

export default Editor;