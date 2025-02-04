"use client";
import React from "react";
import { TextRevealCard, TextRevealCardDescription, TextRevealCardTitle } from "./text-reveal-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Spinner } from "@/components/spinner";
import { SignInButton } from "@clerk/clerk-react";
import { useConvexAuth } from "convex/react";

export function TextRevealCardUse() {
    const { isAuthenticated, isLoading } = useConvexAuth();

    return (
        <div className="h-[30rem] w-full">
            <div className="flex items-center justify-center rounded-2xl w-full">
                <TextRevealCard
                    text="Pay only for the words you use."
                    revealText="Fees? Practically Zero."
                >
                    <TextRevealCardTitle>
                        Token-based pricing powered by Stripe..
                    </TextRevealCardTitle>
                    <TextRevealCardDescription>
                        Experience the power of AI with minimal cost..
                    </TextRevealCardDescription>
                </TextRevealCard>
            </div>

            {isLoading && (
                <div className="w-full flex item-center justify-center">
                    <Spinner size="lg" />
                </div>
            )}
            {isAuthenticated && !isLoading && (
                <Button asChild className="mt-5">
                    <Link href="/documents">
                        Enter CleverNotes
                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition" />
                    </Link>
                </Button>
            )}
            {!isAuthenticated && !isLoading && (
                <SignInButton mode="modal">
                    <Button className="mt-5">
                        Get CleverNotes free
                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition" />
                    </Button>
                </SignInButton>
            )}
        </div>
    );
}
