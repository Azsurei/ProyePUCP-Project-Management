const express = require("express");
const connection = require("../config/db");
const { verifyToken } = require("../middleware/middlewares");

const routerUsuario = express.Router();
const usuarioController = require("../controllers/usuario/usuarioController");

routerUsuario.post("/listarUsuarios", verifyToken, usuarioController.listarUsuarios);
routerUsuario.get("/verInfoUsuario", verifyToken, usuarioController.verInfoUsuario);
routerUsuario.post("/verRolUsuarioEnProyecto", verifyToken, usuarioController.verRolUsuarioEnProyecto);
routerUsuario.post("/insertarUsuariosAProyecto", verifyToken, usuarioController.insertarUsuariosAProyecto);
routerUsuario.put("/cambiarPassword", usuarioController.cambiarPassword);
routerUsuario.post("/enviarNotificacion", verifyToken, usuarioController.enviarNotificacion );
routerUsuario.post("/listarNotificaciones", verifyToken, usuarioController.listarNotificaciones );
routerUsuario.post("/actualizaNotificacionAR", verifyToken, usuarioController.actualizaNotificacionAR );
routerUsuario.post("/modificaEstadoNotificacionXIdNotificacion", verifyToken, usuarioController.modificaEstadoNotificacionXIdNotificacion );
routerUsuario.post("/modificaEstadoNotificacionXIdUsuario", verifyToken, usuarioController.modificaEstadoNotificacionXIdUsuario );

routerUsuario.post("/modificarPreferenciaNotificacionPresupuesto", verifyToken, usuarioController.modificarPreferenciaNotificacionPresupuesto );

routerUsuario.post("/verificarNotificacionesPresupuesto",verifyToken,usuarioController.verificarNotificacionesPresupuesto);

routerUsuario.put("/modificarPrivilegios",verifyToken,usuarioController.modificarPrivilegios);

// Modificar. Este modificar no modifica ni el correo ni la contraseña
routerUsuario.put("/modificarUsuario",verifyToken, usuarioController.modificarDatos);

module.exports.routerUsuario = routerUsuario;
