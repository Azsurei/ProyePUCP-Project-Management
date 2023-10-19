import { NUIProvider } from "./providers/NUIProvider";
import { NextAuthProvider } from "./providers/NextAuthProvider";
import "@/styles/globals.css";

export default function RootLayout({ children }) {
    return (
        <html lang="es">
            <body className="global-styles">
                <NextAuthProvider>
                    <NUIProvider>
                        {children}
                    </NUIProvider>
                </NextAuthProvider>
            </body>
        </html>
    );
}
