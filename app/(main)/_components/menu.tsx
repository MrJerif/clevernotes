"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useUser } from "@clerk/clerk-react";
import { useMutation, useQuery } from "convex/react";
import { DownloadIcon, MoreHorizontal, ScissorsIcon, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FolderItem } from "./folder-item";
import jsPDF from "jspdf";

interface MenuProps {
    documentId: Id<"documents">
    folderId?: Id<"folders">
};

interface MDContentNodeProps {
    type: "heading" | "paragraph" | "codeBlock" | "numberedListItem" | "bulletListItem"
    | "checkListItem" | "table" | "image" | "video" | "file" | "audio" | "emoji" | string;
    props?: {
        level?: number  // For headings
        checked?: boolean; // For checklists
        lang?: string; // For code blocks
        url?: string; // For media like images, videos, files, audio
        alt?: string; // Alt text for images
        columns?: string[]; // Column headers for tables
        textColor?: string;
        backgroundColor?: string;
        textAlignment?: string;
    };
    content?: Array<{ type: string; text: string; style: object }> | string;
    children?: MDContentNodeProps[];
};

interface ContentBlockProps {
    type: "heading" | "paragraph" | "numberedListItem" | "bulletListItem" | "checkListItem";
    value: string | string[]
};


export const Menu = ({ documentId, folderId }: MenuProps) => {
    const router = useRouter();
    const { user } = useUser();
    const archive = useMutation(api.documents.archive);
    const move = useMutation(api.documents.moveNotes);

    // get request (Folders)
    const folders = useQuery(api.documents.getFolders, {
        folderId: folderId
    });

    // get Request (notes by Id)
    const documents = useQuery(api.documents.getById, {
        documentId: documentId
    });

    const onArchive = () => {
        const promise = archive({ id: documentId })

        toast.promise(promise, {
            loading: "Moving to trash...",
            success: "Note moved to trash!",
            error: "Failed to archive note ("
        });

        router.push("/documents");
    };

    // Move notes to different folder
    const moveNotes = (fId: Id<"folders">) => {
        if (!documentId) return;
        const id = documentId;

        const promise = move({
            id,
            folderId: fId
        })
            .then(() => router.push(`/documents/${documentId}`))

        toast.promise(promise, {
            loading: "Moving Note...",
            success: "Note moved to Folder!",
            error: "Failed to move note ("
        })
    };

    if (documents === null) {
        return <div> Not found </div>
    }

    // Convert JSON content into markdown content
    const convertToMd = (contentArray: MDContentNodeProps[]): string => {
        if (!Array.isArray(contentArray)) {
            throw new Error("Content must be an array");
        }
        const mdContent: string[] = [];

        contentArray.forEach((node) => {
            switch (node.type) {
                case "heading": {
                    const headingLevel = "#".repeat(node.props?.level || 1);
                    const headingText = Array.isArray(node.content)
                        ? node.content.map((c) => c.text).join("")
                        : "";
                    mdContent.push(`${headingLevel} ${headingText}`);
                    break;
                }

                case "paragraph": {
                    const paragraphText = Array.isArray(node.content)
                        ? node.content.map((c) => c.text).join("")
                        : node.content || "";
                    mdContent.push(paragraphText);
                    break;
                }

                case "numberedListItem": {
                    const listItemText = Array.isArray(node.content)
                        ? node.content.map((c) => c.text).join("")
                        : node.content || "";
                    mdContent.push(`1. ${listItemText}`);
                    break;
                }

                case "bulletListItem": {
                    const listItemText = Array.isArray(node.content)
                        ? node.content.map((c) => c.text).join("")
                        : node.content || "";
                    mdContent.push(`- ${listItemText}`);
                    break;
                }

                case "checkListItem": {
                    const checked = node.props?.checked ? "[x]" : "[ ]";
                    const listItemText = Array.isArray(node.content)
                        ? node.content.map((c) => c.text).join("")
                        : node.content || "";
                    mdContent.push(`${checked} ${listItemText}`);
                    break;
                }

                case "codeBlock": {
                    const lang = node.props?.lang || "";
                    const codeText = Array.isArray(node.content)
                        ? node.content.map((c) => c.text).join("")
                        : node.content || "";
                    mdContent.push(`\`\`\`${lang}\n${codeText}\n\`\`\``);
                    break;
                }

                case "table": {
                    const columns = node.props?.columns || [];
                    const headerRow = `| ${columns.join(" | ")} |`;
                    const separatorRow = `| ${columns.map(() => "---").join(" | ")} |`;
                    mdContent.push(headerRow, separatorRow);
                    if (Array.isArray(node.children)) {
                        node.children.forEach((row) => {
                            const rowData = Array.isArray(row.content)
                                ? row.content.map((c) => c.text).join(" | ")
                                : "";
                            mdContent.push(`| ${rowData} |`);
                        });
                    }
                    break;
                }

                case "image": {
                    const url = node.props?.url || "";
                    const alt = node.props?.alt || "";
                    mdContent.push(`![${alt}](${url})`);
                    break;
                }

                case "video":
                case "file":
                case "audio": {
                    const url = node.props?.url || "";
                    const typeLabel =
                        node.type === "video"
                            ? "Video"
                            : node.type === "audio"
                                ? "Audio"
                                : "File";
                    mdContent.push(`[${typeLabel}](${url})`);
                    break;
                }

                case "emoji": {
                    const emojiText = Array.isArray(node.content)
                        ? node.content.map((c) => c.text).join("")
                        : node.content || "";
                    mdContent.push(emojiText);
                    break;
                }

                default:
                    if (node.children && node.children.length > 0) {
                        const childMarkdown = convertToMd(node.children);
                        mdContent.push(childMarkdown);
                    }
                    break;
            }
        });

        return mdContent.join("\n\n");
    };


    // Download as Markdown
    function downloadMarkdown() {
        if (!documents || !documents.content) return;
        let contentArray = [];
        contentArray = JSON.parse(documents.content);
        // const jsonContent = JSON.parse(documents.content!);
        const markdownContent = convertToMd(contentArray);
        // const documentMd = documents.find((doc) => doc._id === documentId);
        const blob = new Blob([markdownContent], { type: 'text/markdown' })
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;

        // filter the title
        let sanitizedTitle = documents?.title.replace(/\s+/g, '');
        sanitizedTitle = sanitizedTitle?.substring(0, 15);
        sanitizedTitle = sanitizedTitle || 'untitled';
        link.download = `${sanitizedTitle}.md`;
        link.click();
    };

    if (!documents || !documents.content) return;
    let pdfArray = [];
    pdfArray = JSON.parse(documents.content)

    const downloadAsPDF = (contentArray: MDContentNodeProps[]): void => {
        if (!Array.isArray(contentArray)) {
            throw new Error("Content must be an array");
        }
        // const pdfContent: string[] = [];

        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.width; // Get the page width
        let currentYPosition = 10; // Initial vertical position

        const addTextToPDF = (text: string) => {
            // Split text into lines that fit within the page width
            const lines = doc.splitTextToSize(text, pageWidth - 20); // 20 is a margin

            lines.forEach((line: string) => {
                // Check if the current line exceeds the page height, if so, add a new page
                const textHeight = doc.getTextDimensions(line).h;
                if (currentYPosition + textHeight > doc.internal.pageSize.height) {
                    doc.addPage();
                    currentYPosition = 10; // Reset vertical position to the top of the new page
                }

                doc.text(line, 10, currentYPosition); // Add the line at the current Y position
                currentYPosition += textHeight + 2; // Update the vertical position for the next line
            });
        };

        contentArray.forEach((node, index) => {
            switch (node.type) {
                case "heading": {
                    const headingLevel = node.props?.level || 1;
                    const headingText = Array.isArray(node.content)
                        ? node.content.map((c) => c.text).join("")
                        : "";

                    doc.setFontSize(headingLevel === 1 ? 24 : 18);
                    // doc.text(headingText, 10, 10 + (index * 10));
                    addTextToPDF(headingText); // Add heading text with wrapping
                    break;
                }

                case "paragraph": {
                    const paragraphText = Array.isArray(node.content)
                        ? node.content.map((c) => c.text).join("")
                        : node.content || "";

                    doc.setFontSize(12);
                    // doc.text(paragraphText, 10, 10 + (index * 10));
                    addTextToPDF(paragraphText);
                    break;
                }

                case "numberedListItem": {
                    const listItemText = Array.isArray(node.content)
                        ? node.content.map((c) => c.text).join("")
                        : node.content || "";

                    doc.setFontSize(12);
                    // doc.text(`1. ${listItemText}`, 10, 10 + (index * 10));
                    addTextToPDF(`1. ${listItemText}`);
                    break;
                }

                case "bulletListItem": {
                    const listItemText = Array.isArray(node.content)
                        ? node.content.map((c) => c.text).join("")
                        : node.content || "";

                    doc.setFontSize(12);
                    // doc.text(`- ${listItemText}`, 10, 10 + (index * 10));
                    addTextToPDF(`- ${listItemText}`);
                    break;
                }

                case "checkListItem": {
                    const checked = node.props?.checked ? "[x]" : "[ ]";
                    const listItemText = Array.isArray(node.content)
                        ? node.content.map((c) => c.text).join("")
                        : node.content || "";

                    doc.setFontSize(12);
                    // doc.text(`${checked} ${listItemText}`, 10, 10 + (index * 10));
                    addTextToPDF(`${checked} ${listItemText}`);
                    break;
                }

                case "codeBlock": {
                    const lang = node.props?.lang || "";
                    const codeText = Array.isArray(node.content)
                        ? node.content.map((c) => c.text).join("")
                        : node.content || "";

                    doc.setFontSize(10);
                    doc.setFont("courier");
                    // doc.text(`\`\`\`${lang}\n${codeText}\n\`\`\``, 10, 10 + (index * 10));
                    addTextToPDF(`\`\`\`${lang}\n${codeText}\n\`\`\``);
                    break;
                }

                case "table": {
                    const columns = node.props?.columns || [];
                    const headerRow = `| ${columns.join(" | ")} |`;
                    const separatorRow = `| ${columns.map(() => "---").join(" | ")} |`;

                    doc.setFontSize(12);
                    // doc.text(headerRow, 10, 10 + (index * 10));
                    // doc.text(separatorRow, 10, 15 + (index * 10));
                    addTextToPDF(headerRow);
                    addTextToPDF(separatorRow);

                    if (Array.isArray(node.children)) {
                        node.children.forEach((row, rowIndex) => {
                            const rowData = Array.isArray(row.content)
                                ? row.content.map((c) => c.text).join(" | ")
                                : "";
                            // doc.text(`| ${rowData} |`, 10, 20 + (index * 10) + (rowIndex * 5));
                            addTextToPDF(`| ${rowData} |`);
                        });
                    }
                    break;
                }

                case "image": {
                    const url = node.props?.url || "";
                    const alt = node.props?.alt || "";
                    doc.setFontSize(12);
                    // doc.text(`![${alt}](${url})`, 10, 10 + (index * 10));
                    addTextToPDF(`![${alt}](${url})`); 
                    break;
                }

                case "video":
                case "file":
                case "audio": {
                    const url = node.props?.url || "";
                    const typeLabel =
                        node.type === "video"
                            ? "Video"
                            : node.type === "audio"
                                ? "Audio"
                                : "File";
                    doc.setFontSize(12);
                    // doc.text(`[${typeLabel}](${url})`, 10, 10 + (index * 10));
                    addTextToPDF(`[${typeLabel}](${url})`); 
                    break;
                }

                case "emoji": {
                    const emojiText = Array.isArray(node.content)
                        ? node.content.map((c) => c.text).join("")
                        : node.content || "";

                    doc.setFontSize(12);
                    // doc.text(emojiText, 10, 10 + (index * 10));
                    addTextToPDF(emojiText); 
                    break;
                }

                default:
                    if (node.children && node.children.length > 0) {
                        // const childMarkdown = 
                        downloadAsPDF(node.children);
                        // doc.text(childMarkdown, 10, 10 + (index * 10));
                    }
                    break;
            }
        });

        // Sanitize the title for the PDF file name (remove spaces and truncate to 15 characters)
        let sanitizedTitle = documents?.title.replace(/\s+/g, '_'); // Replacing spaces with underscores
        sanitizedTitle = sanitizedTitle.substring(0, 15);
        sanitizedTitle = sanitizedTitle || 'untitled';

        // Save the PDF with the sanitized title
        doc.save(`${sanitizedTitle}.pdf`);
    };

    // Download as PDF file
    // const downloadAsPDF = () => {
    //     // Check if documents or content exists
    //     if (!documents || !documents?.content) return;

    //     // Create a new jsPDF instance
    //     const pdf = new jsPDF();
    //     // Parse the content (if it's a stringified JSON, we'll parse it)
    //     let contentArray: ContentBlockProps[] = [];
    //     // console.log('Documents.content: ', documents.content);
    //     try {
    //         contentArray = JSON.parse(documents.content); // If content is JSON string
    //         console.log("content array : ", contentArray);
    //     } catch (error) {
    //         console.log("Failed to parse document contet:", error);
    //         return;
    //     }

    //     // Set initial font size
    //     pdf.setFontSize(12);

    //     // Position for starting text in the PDF
    //     let yPosition = 10;
    //     const lineHeight = 7;
    //     const margin = 10;

    //     // Function to render headings
    //     const renderHeading = (text: string) => {
    //         if (typeof text !== "string") return;
    //         pdf.setFontSize(14).setFont("helvetica", "bold");
    //         const lines = pdf.splitTextToSize(text, 180);
    //         lines.forEach((line: string) => {
    //             pdf.text(line, margin, yPosition);
    //             yPosition += lineHeight;
    //         });
    //         pdf.setFontSize(12).setFont("helvetica", "normal");
    //     };

    //     // Function to handle paragraphs
    //     const renderParagraph = (text: string) => {
    //         if (typeof text !== "string") return;
    //         const lines = pdf.splitTextToSize(text, 180);
    //         lines.forEach((line: string) => {
    //             pdf.text(line, margin, yPosition);
    //             yPosition += lineHeight;
    //         });
    //     };

    //     // Function to render lists
    //     const renderList = (items: string[], isOrdered: boolean = false) => {
    //         if (!Array.isArray(items)) return;
    //         items.forEach((item, index) => {
    //             const prefix = isOrdered ? `${index + 1}.` : "•";
    //             const lines = pdf.splitTextToSize(`${prefix} ${item}`, 180);
    //             lines.forEach((line: string) => {
    //                 pdf.text(line, margin, yPosition);
    //                 yPosition += lineHeight;
    //                 // checkPageOverflow();
    //             });
    //         });
    //     };

    //     // Iterate through the content array
    //     contentArray.forEach((block: ContentBlockProps) => {
    //         if (!block || typeof block.type !== "string" || block.value === undefined) {
    //             console.warn("Invalid Block: ", block);
    //             console.warn("Invalid Block.type: ", block.type);
    //             console.warn("Invalid Block.value: ", block.value);
    //             return;
    //         }

    //         switch (block.type) {
    //             case "heading":
    //                 // if (typeof block.value === "string") {
    //                 //     pdf.setFontSize(18); // Larger font size for headers
    //                 //     pdf.text(block.value as string, 10, yPosition);
    //                 //     yPosition += lineHeight * 2; // Add extra space after header
    //                 //     pdf.setFontSize(12); // Reset font size to normal for other types
    //                 // }
    //                 renderHeading(block.value as string);
    //                 break;
    //             case "paragraph": {
    //                 // Render paragraph
    //                 renderParagraph(block.value as string);
    //                 break;
    //             }
    //             case "numberedListItem":
    //                 renderList(block.value as string[], true);
    //                 break;
    //             case "bulletListItem":
    //                 renderList(block.value as string[], false);
    //                 break;
    //             // case "checkListItem": 
    //             //     // Render list
    //             //     renderList(block.value as string[]);
    //             //     break;

    //             default: {
    //                 console.warn("Unknown block type: ", block.type);
    //                 // For any unknown type, just render as normal text
    //                 // renderParagraph(block.value as string);
    //                 break;
    //             }
    //         }

    //         // Add new page if content exceeds the page height
    //         if (yPosition > 280) {
    //             pdf.addPage();
    //             yPosition = 10;
    //         }
    //     });

    //     // Sanitize the title for the PDF file name (remove spaces and truncate to 15 characters)
    //     let sanitizedTitle = documents?.title.replace(/\s+/g, '_'); // Replacing spaces with underscores
    //     sanitizedTitle = sanitizedTitle.substring(0, 15);
    //     sanitizedTitle = sanitizedTitle || 'untitled';

    //     // Save the PDF with the sanitized title
    //     pdf.save(`${sanitizedTitle}.pdf`);
    // };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button size="sm" variant="ghost">
                    <MoreHorizontal />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-60"
                align="end"
                alignOffset={8}
            >
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
                <DropdownMenuItem onClick={onArchive} className="hover:cursor-pointer">
                    <Trash className="h-4 w-4 mr-2" />
                    Delete
                </DropdownMenuItem>

                <DropdownMenuItem onClick={downloadMarkdown}>
                    <DownloadIcon className="h-4 w-4 mr-2" />
                    Markdown (.md)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => downloadAsPDF(pdfArray)}>
                    <DownloadIcon className="h-4 w-4 mr-2" />
                    Pdf (.pdf)
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <div className="text-xs text-muted-foreground p-2">
                    Last edited by: {user?.fullName ? user?.fullName : user?.emailAddresses[0].emailAddress}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

Menu.Skeleton = function MenuSkeleton() {
    return (
        <Skeleton className="h-8 w-8" />
    );
};