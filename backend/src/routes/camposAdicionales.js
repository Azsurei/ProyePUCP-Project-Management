const express = require("express");
const connection = require("../config/db");
const { verifyToken } = require("../middleware/middlewares");

const routerCamposAdicionales = express.Router();
const camposAdicionalesController = require("../controllers/camposAdicionalesController");

routerCamposAdicionales.post("/listarCamposAdicionales", verifyToken, camposAdicionalesController.listarCamposAdicionales);

module.exports.routerCamposAdicionales = routerCamposAdicionales;