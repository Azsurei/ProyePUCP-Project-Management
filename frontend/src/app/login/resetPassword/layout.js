import styles from '@/styles/landing.module.css';
import '@/styles/globals.css';

export default function RootLayout({ children }) {
    return (
      <html lang="es">
        <body className={`${styles.body} global-styles`}>{children}</body>
      </html>
    )
  }