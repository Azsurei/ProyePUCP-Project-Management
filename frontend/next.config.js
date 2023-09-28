/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
          {
            source: '/api/:path*', // Ruta de la API en tu servidor Node.js
            destination: 'http://localhost:8080/api/:path*', // URL de tu servidor Node.js
          },
        ];
      },
}

module.exports = nextConfig
