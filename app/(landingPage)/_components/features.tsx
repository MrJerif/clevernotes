"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function Features() {
    return (
        <>
            <div className="flex flex-col md:flex-row gap-4">
                {/* 1st row */}
                <div className={cn("max-w-lg w-full border rounded-md relative group hover:bg-purple-500 backdrop-blur-md backdrop-saturate-150")}
                    onMouseEnter={() => {
                        const videoElement = document.querySelector('.video-hover1') as HTMLVideoElement;
                        if (videoElement) videoElement.play();
                    }}
                    onMouseLeave={() => {
                        const videoElement = document.querySelector('.video-hover1') as HTMLVideoElement;
                        if (videoElement) videoElement.pause();
                    }}
                >
                    <video
                        src='/feature1.webm'
                        width="full"
                        height={1400}
                        className="object-contain rounded-lg border video-hover1 transform group-hover:transition duration-500 ease-in-out group-hover:scale-105 group-hover:-rotate-1"
                        loop
                        preload="auto"
                    />
                    <div className="text relative z-50">
                        <h1 className="font-bold text-xl md:text-3xl dark:text-gray-50 text-zinc-800 relative">
                            Effortless Note Creation
                        </h1>
                        <p className="font-normal text-base dark:text-gray-50 text-zinc-800 relative my-4">
                            Create notes, readme files, with ease. Create folders and add description to keep your notes systematically organized. Quickly find the information you need, when you need it.
                        </p>
                    </div>
                </div>
                <div className="max-w-lg w-full border rounded-md relative group hover:bg-purple-500 backdrop-blur-md backdrop-saturate-150"
                    onMouseEnter={() => {
                        const videoElement = document.querySelector('.video-hover2') as HTMLVideoElement;
                        if (videoElement) videoElement.play();
                    }}
                    onMouseLeave={() => {
                        const videoElement = document.querySelector('.video-hover2') as HTMLVideoElement;
                        if (videoElement) videoElement.pause();
                    }}
                >
                    <video
                        src='/feature3.webm'
                        width="full"
                        height={1400}
                        className="object-contain rounded-lg border video-hover2 transform group-hover:transition duration-500 ease-in-out group-hover:scale-105 group-hover:rotate-1"
                        loop
                        preload="auto"
                    />
                    <div className="text relative z-50">
                        <h1 className="font-bold text-xl md:text-3xl dark:text-gray-50 text-zinc-800 relative">
                            Seamless Collaboration
                        </h1>
                        <p className="font-normal text-base dark:text-gray-50 text-zinc-800 relative my-4">
                            Share notes and folders with colleagues, friends, or clients via unique links.
                        </p>
                    </div>
                </div>
            </div>

            {/* 2nd Row */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="max-w-lg w-full border rounded-md relative group hover:bg-purple-500 backdrop-blur-md backdrop-saturate-150"
                    onMouseEnter={() => {
                        const videoElement = document.querySelector('.video-hover3') as HTMLVideoElement;
                        if (videoElement) videoElement.play();
                    }}
                    onMouseLeave={() => {
                        const videoElement = document.querySelector('.video-hover3') as HTMLVideoElement;
                        if (videoElement) videoElement.pause();
                    }}
                >
                    <video
                        src='/feature4.webm'
                        width="full"
                        height={1400}
                        className="video-hover3 object-contain rounded-lg border transition-transform duration-500 ease-in-out transform group-hover:rotate-3 group-hover:translate-x-2 group-hover:translate-y-1"
                        loop
                        preload="auto"
                    />
                    <div className="text relative z-50">
                        <h1 className="font-bold text-xl md:text-3xl dark:text-gray-50 text-zinc-800 relative">
                            Flexible Export Options
                        </h1>
                        <p className="font-normal text-base dark:text-gray-50 text-zinc-800 relative my-4">
                            Download notes as PDF, Markdown. Easily export individual notes.
                        </p>
                    </div>
                </div>
                <div className="max-w-lg w-full border rounded-md relative group hover:bg-purple-500 backdrop-blur-md backdrop-saturate-150"
                    onMouseEnter={() => {
                        const videoElement = document.querySelector('.video-hover4') as HTMLVideoElement;
                        if (videoElement) videoElement.play();
                    }}
                    onMouseLeave={() => {
                        const videoElement = document.querySelector('.video-hover4') as HTMLVideoElement;
                        if (videoElement) videoElement.pause();
                    }}
                >
                    <video
                        src='/feature1.webm'
                        width="full"
                        height={1400}
                        className="video-hover4 object-contain rounded-lg border transition-transform duration-500 ease-in-out transform group-hover:-rotate-3 group-hover:translate-x-2 group-hover:translate-y-1"
                        loop
                        preload="auto"
                    />
                    <div className="text relative z-50">
                        <h1 className="font-bold text-xl md:text-3xl dark:text-gray-50 text-zinc-800 relative">
                            Powerful Organization
                        </h1>
                        <p className="font-normal text-base dark:text-gray-50 text-zinc-800 relative my-4">
                            Create a structured hierarchy with folders and subNotes. Powerful search functionality to quickly find any note.
                        </p>
                    </div>
                </div>
            </div>

            {/* 3rd Row */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="max-w-lg w-full border rounded-md relative group hover:bg-purple-500 backdrop-blur-md backdrop-saturate-150"
                    onMouseEnter={() => {
                        const videoElement = document.querySelector('.video-hover5') as HTMLVideoElement;
                        if (videoElement) videoElement.play();
                    }}
                    onMouseLeave={() => {
                        const videoElement = document.querySelector('.video-hover5') as HTMLVideoElement;
                        if (videoElement) videoElement.pause();
                    }}
                >
                    <video
                        src='/feature-ai.webm'
                        width="full"
                        height={1400}
                        className="video-hover5 object-contain rounded-lg border transition-all duration-500 ease-in-out transform group-hover:translate-y-[-10px] group-hover:scale-105 group-hover:rotate-[1deg]"
                        loop
                        preload="auto"
                    />
                    <div className="text relative z-50">
                        <h1 className="font-bold text-xl md:text-3xl dark:text-gray-50 text-zinc-800 relative">
                            AI-Powered Insights
                        </h1>
                        <p className="font-normal text-base dark:text-gray-50 text-zinc-800 relative my-4">
                            <b> Document-Specific AI: </b>
                            Ask questions about your notes, files and get instant answers based solely on their content. AI can summarize, analyze, and provide insights from your documents. <br />
                            <b> Web-Based AI: </b>
                            Explore broader knowledge by allowing AI to search both your notes and the internet for comprehensive answers.
                        </p>
                    </div>
                </div>

                <div className="max-w-lg w-full border rounded-md relative group hover:bg-purple-500 backdrop-blur-md backdrop-saturate-150"
                    onMouseEnter={() => {
                        const videoElement = document.querySelector('.video-hover6') as HTMLVideoElement;
                        if (videoElement) videoElement.play();
                    }}
                    onMouseLeave={() => {
                        const videoElement = document.querySelector('.video-hover6') as HTMLVideoElement;
                        if (videoElement) videoElement.pause();
                    }}
                >
                    <video
                        src='/feature-ai.webm'
                        width="full"
                        height={1400}
                        className="video-hover6 object-contain rounded-lg border transition-all duration-500 ease-in-out transform group-hover:translate-y-[-10px] group-hover:scale-105 group-hover:-rotate-[1deg]"
                        loop
                        preload="auto"
                    />
                    <div className="text relative z-50">
                        <h1 className="font-bold text-xl md:text-3xl dark:text-gray-50 text-zinc-800 relative">
                            AI-Powered Answers Across Multiple Files
                        </h1>
                        <p className="font-normal text-base dark:text-gray-50 text-zinc-800 relative my-4">
                            Effortlessly analyze information across multiple files. AI intelligently synthesizes information from all selected files to provide accurate and comprehensive answers.
                        </p>
                    </div>
                </div>
            </div>

            <Button asChild className="mb-10">
                <Link href="https://github.com/MrJerif/clevernotes/blob/main/README.md">
                    Know More...
                </Link>
            </Button>
        </>
    );
}
