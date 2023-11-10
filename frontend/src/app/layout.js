"use client";
import { useEffect } from "react";
import { NUIProvider } from "./providers/NUIProvider";
import "@/styles/globals.css";
import Head from 'next/head';

export default function RootLayout({ children }) {
    return (
        <html lang="es">
            <head>
                <link rel="icon" href={"/favicon.ico"} />
                <script
                    src="https://accounts.google.com/gsi/client"
                    async
                    defer
                ></script>
                <title>ProyePUCP</title>
            </head>
            <body className="global-styles">
                <NUIProvider>{children}</NUIProvider>
            </body>
        </html>
    );
}
