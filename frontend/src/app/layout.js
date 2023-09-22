import '@/styles/globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="global-styles">{children}</body>
    </html>
  )
}