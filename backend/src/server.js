const express = require("express");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const cors = require("cors");
require('dotenv').config({ path: './../.env' });
const socketIO = require("socket.io");
const app = express();
const port = 8080;

const http = require("http");
const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
        origin: "http://localhost",
        methods: ["GET", "POST"],
    },
});

//Usamos el router de loggin
//const routerProgramacion = require('../../routes/routerLogin').routerLoggin;
//app.use('/api/loggin',routerProgramacion);

// Middleware para cookies
app.use(cookieParser());

// Middleware para parsear las peticiones con contenido JSON
app.use(bodyParser.json());
app.use(cors({ origin: process.env.SERVER_URL, credentials: true }));

const routerAuth = require("./routes/auth").routerAuth;
const routerProyecto = require("./routes/proyecto").routerProyecto;
const routerUsuario = require("./routes/usuario").routerUsuario;
const routerHerramientas = require("./routes/herramientas").routerHerramientas;
const routerAdmin = require("./routes/admin").routerAdmin;
const routerFiles = require("./routes/files").routerFiles;

app.use("/api/herramientas", routerHerramientas);
app.use("/api/auth", routerAuth);
app.use("/api/proyecto", routerProyecto);
app.use("/api/usuario", routerUsuario);
app.use("/api/admin", routerAdmin);
app.use("/api/files", routerFiles);

const startCronJob = require("./config/cronJobs");

startCronJob();


const connectedUsers = new Map();
io.on("connection", (socket) => {
    // Extract idUsuario from the handshake query
    const idUsuario = socket.handshake.query.idUsuario;
    const nombreUsuario = socket.handshake.query.nombresUsuario;

    console.log(
        `===========================\nUser connected: ${socket.id}\nidUsuario => ${idUsuario}\n nombreUsuario => ${nombreUsuario}\n===========================`
    );

    connectedUsers.set(parseInt(idUsuario), socket.id);

    socket.on("private_message", (data) => {
        console.log("MIRA LA LISTA DE CONTECTADOS => " + JSON.stringify(connectedUsers,null,2));
        const { targetUserId, message } = data;

        const targetSocketId = connectedUsers.get(parseInt(targetUserId));

        if (targetSocketId) {
            io.to(targetSocketId).emit("private_message", {
                senderUserId: idUsuario,
                message,
            });
        } else {
            console.log(`User with idUsuario ${targetUserId} is not connected`);
        }
    });

    socket.on("disconnect", () => {
        connectedUsers.delete(idUsuario);
        console.log(
            `User disconnected: ${socket.id} with idUsuario = ${idUsuario}`
        );
    });
});

//Empezar a escuchar en puerto 8080
const PORT = process.env.SERVER_PORT || 8080;
server.listen(PORT, () => {
    console.log(`Servidor API corriendo en el puerto ${PORT}`);
});
