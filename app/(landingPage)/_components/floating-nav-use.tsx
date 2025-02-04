"use client";
import React from "react";
import { FloatingNav } from "./floating-navbar";
import { ContainerScroll } from "./container-scroll-animation";
import { StarsBackground } from "./stars-bg";
import { ShootingStars } from "./shooting-stars";
export function FloatingNavUse() {
    const navItems = [
        {
            name: "Documents",
            link: "/documents",
            // icon: <FolderOpen className="h-4 w-4 text-neutral-500 dark:text-white" />,
        },
        {
            name: "About",
            link: "https://github.com/MrJerif/clevernotes",
            // icon: <Github className="h-4 w-4 text-neutral-500 dark:text-white" />,
        },
    ];
    return (
        <div className="relative  w-full">
            <FloatingNav navItems={navItems} />
            <DummyContent />
        </div>
    );
}
const DummyContent = () => {
    return (
        <div>
            <StarsBackground />
            <ShootingStars />
            <ContainerScroll
                titleComponent={
                    <>
                        <h1 className="text-4xl font-semibold text-black dark:text-white">
                            Spend less time managing your notes and more time focusing on
                            {/* CleverNotes' intuitive interface makes note-taking */}
                            <br />
                            <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none dark:from-neutral-100 dark:to-neutral-300 from-slate-500 to-slate-900">
                                what matters most.
                                {/* a breeze. */}
                            </span>
                        </h1>
                    </>
                }
            >
                <video
                    className="mx-auto rounded-2xl object-fill h-[99%] object-left-top"
                    preload="metadata"
                    autoPlay
                    loop
                    playsInline
                    >
                        <source src='/mainvideo.webm' type="video/webm"/>
                        <source src='/mainvideo.mp4' type="video/mp4"/>
                </video>
            </ContainerScroll>
        </div>
    );
};
