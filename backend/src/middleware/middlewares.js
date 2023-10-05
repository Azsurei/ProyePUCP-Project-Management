// middlewares.js
const jwt = require("jsonwebtoken");
const secret = "oaiscmawiocnaoiwncioawniodnawoinda";  // Considera guardar tu secret en variables de entorno

module.exports = {
    // Middleware para verificar JWT
    verifyToken: (req, res, next) => {
        const token = req.cookies.tokenProyePUCP;
        if (!token) return res.status(403).send("Token no proporcionado");

        jwt.verify(token, secret, (err, decoded) => {
            if (err) return res.status(500).send("Falló la autenticación de token.");
            //console.log("Loggeado correctamente");
            // Si todo está bien, guardar para su uso en otras rutas
            req.user = decoded.user;
            next();
        });
        console.log(`Token usado:`);
    },

    // Middleware para otro propósito...

}
