import { NUIProvider } from "./providers/NUIProvider";
import "@/styles/globals.css";

export default function RootLayout({ children }) {
    return (
        <html lang="es">
            <body className="global-styles">
                <NUIProvider>{children}</NUIProvider>
            </body>
        </html>
    );
}
