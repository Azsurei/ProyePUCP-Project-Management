module.exports = {
    apps: [
      {
        name: "PROYEPUCP-CLIENT",
        script: "npm",
        args: "run start -p 3000",
        cwd: "./frontend/", // Directorio del front-end
        watch: true,
        env: {
          NODE_ENV: "production"
        }
      },
      {
        name: "PROYEPUCP-SERVER",
        script: "./backend/src/server.js", // Ruta relativa al archivo server.js
        watch: true,
        env: {
          NODE_ENV: "production"
        }
      }
    ]
  };
  