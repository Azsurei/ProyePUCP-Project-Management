'use client';

import { NextUIProvider } from "@nextui-org/react";

export function NUIProvider({ children }) {
    return (
        <NextUIProvider>
            {children}
        </NextUIProvider>
    );
}
