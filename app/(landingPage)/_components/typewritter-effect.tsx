"use client";

import { cn } from "@/lib/utils";
import { motion, useAnimate } from "framer-motion";
import { useEffect, useState } from "react";

export const TypewriterEffect = ({
    words,
    className,
    cursorClassName,
}: {
    words: {
        text: string;
        className?: string;
    }[];
    className?: string;
    cursorClassName?: string;
}) => {
    // split text inside of words into array of characters
    const wordsArray = words.map((word) => ({
        ...word,
        text: word.text.split(""),
    }));

    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [displayedText, setDisplayedText] = useState<string[]>([]);
    const [isTyping, setIsTyping] = useState(true); // Tracks typing or backspacing

    const [scope] = useAnimate();

    useEffect(() => {
        const typeEffect = async () => {
            const currentWord = wordsArray[currentWordIndex].text;

            if (isTyping) {
                // Typing Effect
                for (let i = 0; i <= currentWord.length; i++) {
                    setDisplayedText(currentWord.slice(0, i));
                    await new Promise((resolve) => setTimeout(resolve, 150)); // Slower typing speed
                }
                await new Promise((resolve) => setTimeout(resolve, 1500)); // Pause after typing
                setIsTyping(false); // Switch to backspacing
            } else {
                // Backspacing Effect
                for (let i = currentWord.length; i >= 0; i--) {
                    setDisplayedText(currentWord.slice(0, i));
                    await new Promise((resolve) => setTimeout(resolve, 100)); // Slower backspacing speed
                }
                setIsTyping(true); // Switch to typing next word
                setCurrentWordIndex((prevIndex) => (prevIndex + 1) % wordsArray.length); // Go to next word
            }
        };

        typeEffect();
    }, [isTyping, currentWordIndex]);

    return (
        <div
            className={cn(
                "text-base sm:text-xl md:text-3xl lg:text-5xl font-bold text-center",
                className
            )}
        >
            {/* Render the animated text */}
            <motion.div
                ref={scope}
                className="inline-block"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                {displayedText.map((char, index) => (
                    <span
                        key={`char-${index}`}
                        className={cn("dark:text-white bg-black", wordsArray[currentWordIndex]?.className)}
                    >
                        {char}
                    </span>
                ))}
            </motion.div>

            {/* Add spacing between words */}
            <motion.span className="inline-block mx-2"></motion.span>

            {/* Blinking cursor */}
            <motion.span
                initial={{
                    opacity: 0,
                }}
                animate={{
                    opacity: 1,
                }}
                transition={{
                    duration: 1,
                    repeat: Infinity,
                    repeatType: "reverse",
                }}
                className={cn(
                    "inline-block rounded-sm w-[4px] h-4 md:h-6 lg:h-10 bg-blue-500",
                    cursorClassName
                )}
            ></motion.span>
        </div>
    );
};
