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

  const editedTasks = new Map();

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


    socket.on("access_task_edition", (data, callback) =>{
        console.log("recibi solicitud para acceder a la edicion de una tarea");
        const { idTarea, userData } = data;
        console.log("idTarea => " + idTarea);
        console.log("userData => " + JSON.stringify(userData,null,2));
        console.log("callback => ", callback);
        const userOcupyingTask = editedTasks.get(parseInt(idTarea));

        let accessGranted = false;
        let userOcupying = null;

        if (userOcupyingTask) {
            accessGranted = false;
            userOcupying = userOcupyingTask;
        } else {
            //No esta ocupada, por la que la ocupamos por el usuario que la solicito
            editedTasks.set(parseInt(idTarea), userData);

            accessGranted = true;
            userOcupying = null;
        }

        console.log("Mira el arreglo de tareas ocupadas");
        console.log(editedTasks);
    
        callback({
            accessGranted: accessGranted,
            userOcupying: userOcupying,
        });
    })

    socket.on("exit_task_edition", (data, callback) => {
        console.log("recibi solicitud para salir de la edicion de una tarea");
        const { idTarea } = data;

        editedTasks.delete(parseInt(idTarea));
        callback({
            status: 200,
            message: "Salio de la edicion con exito"
        });
    })

    socket.on("exit_all_edition_by_user", (data) => {
        const { idUser } = data;

        //esto se debe hacer para todo editable donde se desea salir de edicion


        //para tareas
        for (let [key, value] of editedTasks.entries()) {
            if (value.idUsuario === parseInt(idUser)) {
                editedTasks.delete(key);
            }
        };
    });


    socket.on("disconnect", () => {
        connectedUsers.delete(parseInt(idUsuario));

        for (let [key, value] of editedTasks.entries()) {
            if (value.idUsuario === parseInt(idUsuario)) {
                editedTasks.delete(key);
                console.log("Ya no hay un usuario editando la tarea " + key);
            }
        };

        console.log(
            `User disconnected: ${socket.id} with idUsuario = ${idUsuario}`
        );
    });
  });

  return { io, connectedUsers };
};

module.exports = initSocket;