"use client";

import { useState, useEffect } from "react";
import { SettingModal } from "../modals/settings-modal";
import { CoverImageModal } from "../modals/cover-image-modal";

export const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, [])

    if (!isMounted) {
        return null;
    }


    return (
        <>
            <SettingModal />
            <CoverImageModal />
        </>
    );
};