import Image from "next/image";
import { Heading } from "./_components/heading";
import { ShootingStars } from "./_components/shooting-stars";
import { StarsBackground } from "./_components/stars-bg";
import { FloatingNavUse } from "./_components/floating-nav-use";
import { GeminiEffectUse } from "./_components/gemini-effect-use";
import { TextRevealCardUse } from "./_components/textReveal-use";
import {Features} from "./_components/features";

export default function Home() {
  return (
    <div className="min-h-full flex flex-col">
      <div className="flex flex-col items-center justify-center
        md:justify-start text-center gap-y-8 flex-1 px-6 pb-10">
        <StarsBackground />
        <ShootingStars />

        <Heading />
        <FloatingNavUse />
        <GeminiEffectUse />
        <Features />
        {/* <StickyScroll content={content} /> */}
        <TextRevealCardUse />
      </div>
    </div>
  )
}
