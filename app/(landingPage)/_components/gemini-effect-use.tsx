"use client";
import { useScroll, useTransform } from "framer-motion";
import React from "react";
import { GeminiEffect } from "./gemini-effect";
import { StarsBackground } from "./stars-bg";
import { ShootingStars } from "./shooting-stars";

export function GeminiEffectUse() {
    const ref = React.useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });

    const pathLengthFirst = useTransform(scrollYProgress, [0, 0.8], [0.2, 1.2]);
    const pathLengthSecond = useTransform(scrollYProgress, [0, 0.8], [0.15, 1.2]);
    const pathLengthThird = useTransform(scrollYProgress, [0, 0.8], [0.1, 1.2]);
    const pathLengthFourth = useTransform(scrollYProgress, [0, 0.8], [0.05, 1.2]);
    const pathLengthFifth = useTransform(scrollYProgress, [0, 0.8], [0, 1.2]);

    return (
        <div
            className="h-[400vh] w-full rounded-md relative pt-40 overflow-clip"
            ref={ref}
        >
            <StarsBackground />
            <ShootingStars />
            <GeminiEffect
                pathLengths={[
                    pathLengthFirst,
                    pathLengthSecond,
                    pathLengthThird,
                    pathLengthFourth,
                    pathLengthFifth,
                ]}
                // title="CleverNotes is an AI-powered "
                title="Open-Source, AI-Powered"
                description=" note-taking and sharing app that revolutionizes the way you capture, organize, and share your ideas
"
            />
        </div>
    );
}
