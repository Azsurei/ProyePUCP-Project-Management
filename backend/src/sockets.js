const Server  = require("socket.io");

const initSocket = (server) => {
  const io = Server (server, {
    cors: {
      origin: process.env.SERVER_URL,
      methods: ["GET", "POST"],
      credentials: true
    },
    path: '/socket'
  });

  const connectedUsers = new Map();

  io.on("connection", (socket) => {
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


    socket.on("send_notification", (data) => {
        console.log("recibi solicitud para mandar notificacion");
        const { targetUserId } = data;

        const targetSocketId = connectedUsers.get(parseInt(targetUserId));

        if (targetSocketId) {
            io.to(targetSocketId).emit("recieve_notification", {
                senderUserId: idUsuario
            });
        } else {
            console.log(`User with idUsuario ${targetUserId} is not connected`);
        }
    });

    socket.on("send_relist_notification", (data) => {
        console.log("recibi solicitud para relistar notificacion");
        const { targetUserId } = data;

        const targetSocketId = connectedUsers.get(parseInt(targetUserId));

        if (targetSocketId) {
            io.to(targetSocketId).emit("relist_notification", {
                senderUserId: idUsuario
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

  return { io, connectedUsers };
};

module.exports = initSocket;