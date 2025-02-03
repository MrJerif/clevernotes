"use client";

import { TypewriterEffect } from "./typewritter-effect";

export const Heading = () => {
    return (
        <>
            <h1 className="absolute left-4 top-28 md:text-6xl font-bold text-3xl">
                Markdown Made Easy
            </h1>

            {/* <div className="h-64 w-64 rounded-full absolute bg-purple-500 border border-white/20 top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2   
            "/> */}

            <div className="max-w-3xl space-y-4 mb-20 md:mb-0 z-[9999]">
                {/* Notes Made Smarter */}
                <h1 className="text-3xl sm:text-5xl md:text-4xl font-bold mt-20">
                    {/* <span className="underline">CleverNotes</span> */}
                    <TypewriterEffect
                        words={[
                            {
                                text: "CleverNotes",
                                className: "font-bold bg-clip-text text-transparent",
                            }
                        ]}
                    />
                    <div className="absolute right-4 md:bottom-24 bottom-32 md:text-6xl font-bold text-3xl">
                        Notes Made Smarter
                    </div>
                </h1>

                <h3 className="text-base sm:text-xl md:text-2xl
                font-medium">
                    {/* CleverNotes is the connected workspace where <br />
                better, faster works happens. */}
                    Create with Markdown, Chat with Documents, <br />
                    Share as Links, Download as pdf and md files <br />
                    Organize Like Never Before..
                </h3>
            </div>
        </>
    )
}