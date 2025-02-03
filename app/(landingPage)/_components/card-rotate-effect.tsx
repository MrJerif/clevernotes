"use client";

import { CardItem } from "@/components/ui/3d-card";
import Image from "next/image";
import React from "react";

export function ThreeDCard() {
  return (
    <div className="relative group w-auto sm:w-[30rem] h-auto rounded-xl overflow-hidden">
      <CardItem
        translateZ="100"
        rotateX={20}
        rotateZ={-10}
        className="w-full h-full"
      >
        <Image
          src="/Organize.png"
          height="1000"
          width="1000"
          className="h-60 w-full object-cover rounded-xl group-hover:shadow-xl"
          alt="thumbnail"
        />
      </CardItem>
    </div>
  );
}
