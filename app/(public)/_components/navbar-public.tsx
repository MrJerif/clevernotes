"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { MenuIcon, SparkleIcon, SparklesIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Title } from "@/app/(main)/_components/title";
import { Menu } from "@/app/(main)/_components/menu";
import { AiFeature } from "@/components/Ai-feature";
import { SignInButton, useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "usehooks-ts";

interface NavbarProps {
    isCollapsed: boolean;
    // onAiResize: (width: number) => void;
};

export const NavbarPublic = ({
    isCollapsed
}: NavbarProps) => {
    const [isAIChatOpen, setIsAIChatOpen] = useState(false);
    const { user } = useUser();
    const isMobile = useMediaQuery("(max-width: 768px)");

    const params = useParams();
    const document = useQuery(api.documents.getPublishedDoc, {
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

    };

    return (
        <>
            <nav className="bg-background dark:bg-[#1F1F1F] px-3 py-2 w-full
            flex items-center gap-x-4"
            >
                {isCollapsed && (
                    <MenuIcon
                        role="button"
                        // onClick={onResetWidth}
                        className="h-6 w-6 text-muted-foreground"
                    />
                )}
                <h2 className="text-lg font-semibold flex px-1">
                    ClassSync
                    <p>
                        <SparkleIcon className='w-5 flex-shrink-0' />
                    </p>
                </h2>
                <div className="flex items-center justify-between w-full">
                    <div className=" text-lg font-bold">
                        <Title initialData={document} />
                    </div>
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
                        {/* <Menu documentId={document._id} /> */}
                    </div>
                </div>
            </nav>
            {/* AI Feature */}
            {user ? (
                <AiFeature
                    isOpen={isAIChatOpen}
                    onClose={() => setIsAIChatOpen(false)}
                />
            ) : (
                <div
                    className={cn('ml-[92vw] text-muted-foreground',
                        isMobile && 'ml-[75vw]'
                    )}>
                    <div>
                        login to use ai
                    </div>
                    <SignInButton mode='modal'>
                        <Button variant="secondary" size="sm">
                            Log in
                        </Button>
                    </SignInButton>
                </div>
            )}
        </>
    )
} 