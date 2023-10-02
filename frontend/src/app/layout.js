import {Providers} from "./providers/provider";
import "@/styles/globals.css";

export default function RootLayout({ children }) {
    return (
        <html lang="es">
            <body className="global-styles">
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    );
}
