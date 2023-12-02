const express = require("express");
const routerAdmin = express.Router();
const { verifyToken } = require("../middleware/middlewares");
const adminController = require("../controllers/admin/adminController");

routerAdmin.get("/listarUsuariosConPrivilegios", adminController.listarUsuariosConPrivilegios);
routerAdmin.put("/cambiarPrivilegioUsuario", adminController.cambiarPrivilegioUsuario);
routerAdmin.put("/cambiarEstadoUsuario", adminController.cambiarEstadoUsuario);

module.exports.routerAdmin = routerAdmin;