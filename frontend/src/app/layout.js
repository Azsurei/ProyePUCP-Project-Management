"use client";
import { useEffect } from "react";
import { NUIProvider } from "./providers/NUIProvider";
import "@/styles/globals.css";

export default function RootLayout({ children }) {


    

    return (
        <html lang="es">
            <head>
                <script
                    src="https://accounts.google.com/gsi/client"
                    async
                    defer
                ></script>
            </head>
            <body className="global-styles">
                <NUIProvider>{children}</NUIProvider>
            </body>
        </html>
    );
}
