"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { MenuIcon, SparklesIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { Title } from "./title";
import { Banner } from "./banner";
import { Menu } from "./menu";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { AiFeature } from "@/components/Ai-feature";
import { Publish } from "./publish";

interface NavbarProps {
    isCollapsed: boolean;
    onResetWidth: () => void;
    onCollapse: () => void;
    onAiResize: (width: number) => void;
};

export const Navbar = ({
    isCollapsed,
    onResetWidth,
    onCollapse,
    onAiResize
}: NavbarProps) => {
    const [isAIChatOpen, setIsAIChatOpen] = useState(false);
    // const [navbarWidth, setNavbarWidth] = useState("100%");

    const params = useParams();
    const document = useQuery(api.documents.getById, {
        documentId: params.documentId as Id<"documents">,
    });

    // Loading
    if (document === undefined) {
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

    if (document === null) {
        return null;
    }

    const toggleAiFeature = () => {
        setIsAIChatOpen(!isAIChatOpen);

        if (!isAIChatOpen && !isCollapsed) {
            onCollapse();
        }
    };

    return (
        <>
            <nav className="bg-background dark:bg-[#1F1F1F] px-3 py-2 w-full
            flex items-center gap-x-4"
            >
                {isCollapsed && (
                    <MenuIcon
                        role="button"
                        onClick={onResetWidth}
                        className="h-6 w-6 text-muted-foreground"
                    />
                )}
                <div className="flex items-center justify-between w-full">
                    <Title initialData={document} />
                    <div className="flex items-center gap-x-2">
                        {/* <div>
                            Like
                        </div>
                        <div> */}
                            {/* Comment */}
                            {/* <MessageSquareTextIcon  className="h-6 w-6 text-muted-foreground hover:text-primary transition cursor-pointer" /> */}
                        {/* </div> */}
                        {/* Share */}
                        {/* <MessageSquareShareIcon  className="h-6 w-6 text-muted-foreground hover:text-primary transition cursor-pointer" /> */}
                        <div>
                            {/* <BotIcon /> */}
                            <SparklesIcon
                                role="button"
                                onClick={toggleAiFeature}
                                className={cn(
                                    "h-6 w-6 text-muted-foreground hover:text-primary transition cursor-pointer",
                                    isAIChatOpen && "text-primary"
                                )}
                            />
                        </div>
                        <Publish initialData={document}/>
                        <Menu documentId={document._id}/>
                    </div>
                </div>
            </nav>
            {/* If document is in Trash */}
            {document.isArchived && (
                <Banner documentId={document._id} />
            )}

            {/* AI Feature */}
            <AiFeature
                isOpen={isAIChatOpen}
                onClose={() => setIsAIChatOpen(false)}
                // onResize={onAiResize}
            />
        </>
    )
} 